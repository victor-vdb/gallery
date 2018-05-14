var functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');
const cors = require('cors')({
  origin: true,
});

// TODO: Use firebase functions:config:set to configure your googleapi object:
// googleapi.client_id = Google API client ID,
// googleapi.client_secret = client secret, and
// googleapi.sheet_id = Google Sheet id (long string in middle of sheet URL)
const CONFIG_CLIENT_ID = functions.config().googleapi.client_id;
const CONFIG_CLIENT_SECRET = functions.config().googleapi.client_secret;
const CONFIG_SHEET_ID = functions.config().googleapi.sheet_id;

// TODO: Use firebase functions:config:set to configure your watchedpaths object:
// watchedpaths.data_path = Firebase path for data to be synced to Google Sheet
//const CONFIG_DATA_PATH = functions.config().watchedpaths.data_path;
const CONFIG_DATA_PATH = 'testdata';

// The OAuth Callback Redirect.
const FUNCTIONS_REDIRECT = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/oauthcallback`;

// setup for authGoogleAPI
const SCOPES = ['https://www.googleapis.com/auth/photoslibrary.readonly'];
const functionsOauthClient = new OAuth2Client(CONFIG_CLIENT_ID, CONFIG_CLIENT_SECRET,
  FUNCTIONS_REDIRECT);

// OAuth token cached locally.
let oauthTokens = null;

// visit the URL for this Function to request tokens
exports.authgoogleapi = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  res.redirect(functionsOauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  }));
});

// setup for OauthCallback
const DB_TOKEN_PATH = '/api_tokens';

// after you grant access, you will be redirected to the URL for this Function
// this Function stores the tokens to your Firebase database
exports.oauthcallback = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  const code = req.query.code;
  functionsOauthClient.getToken(code, (err, tokens) => {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (err) {
      return res.status(400).send(err);
    }
    return admin.database().ref(DB_TOKEN_PATH).set(tokens)
        .then(() => {
          return res.status(200).send('App successfully configured with new Credentials. '
            + 'You can now close this page.');
        });
  });
});


// visit the URL for this Function to request photos
exports.getPhotos = functions.https.onRequest((req, res) => {
    
    return cors(req, res, () => {
        
    let albumId = req.query.albumId;

    getAuthorizedClient().then((client) => { 
        
        let config = {
              // https://github.com/axios/axios#request-config
              url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
              method: 'post',
              headers: {
                  'Content-Type': 'application/json'
              }, 
              data: {
                albumId: albumId
              }    
        }
        
        if (! albumId) {
            config = {
              url: 'https://photoslibrary.googleapis.com/v1/albums',   
            }
        }
        
        client.request(config).then((answer) => {
            
//            var mediaItems = answer.data.mediaItems;
            var items = (! albumId) ? answer.data.albums : answer.data.mediaItems;
            
            for(var i in items){
                let dataRef = '';
                
                if (! albumId) {
                    dataRef = admin.database().ref(`albums/` + items[i].id);
                    const payload = {
                        title: items[i].title,
                        coverPhotoBaseUrl: items[i].coverPhotoBaseUrl,
                        totalMediaItems: items[i].totalMediaItems,
                    };
                    dataRef.update(
                        JSON.parse( JSON.stringify( payload ) )
                    );
                }
                else {
                    dataRef = admin.database().ref(`albums/` + albumId + '/' + items[i].id);
                    dataRef.update({
                        id: items[i].id,
                        baseUrl: items[i].baseUrl,
                    });                  
                }
            } 
            
            return res.status(answer.status).send(answer.statusText);
            
        });
        
    }); 
        
    });
    

//  return new Promise((resolve, reject) => {
//    return getAuthorizedClient().then((client) => {
//      const photoslibrary = google.photoslibrary({
//          version: 'v1',
//          auth: client
//      });
//      const request = {albumId: 'AGj1epX2o8Mix9qFB4ZSRE8LaxOGXY18mKjMtDlv100N9jCLOEG-'};
//      return photoslibrary.albums.get(request, (err, response) => {
//        if (err) {
//          console.log(`The API returned an error: ${err}`);
//          return reject(err);
//        }
//        return resolve(response.data);
//      });
//    });
//  });
    
});

// trigger function to write to Sheet when new data comes in on CONFIG_DATA_PATH
exports.appendrecordtospreadsheet = functions.database.ref(`${CONFIG_DATA_PATH}/{ITEM}`).onCreate(
    (snap) => {
      const newRecord = snap.val();
      return appendPromise({
        spreadsheetId: CONFIG_SHEET_ID,
        range: 'A:C',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[newRecord.firstColumn, newRecord.secondColumn, newRecord.thirdColumn]],
        },
      });
    });

// accepts an append request, returns a Promise to append it, enriching it with auth
function appendPromise(requestWithoutAuth) {
  return new Promise((resolve, reject) => {
    return getAuthorizedClient().then((client) => {
      const sheets = google.sheets('v4');
      const request = requestWithoutAuth;
      request.auth = client;
      return sheets.spreadsheets.values.append(request, (err, response) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
          return reject(err);
        }
        return resolve(response.data);
      });
    });
  });
}

// checks if oauthTokens have been loaded into memory, and if not, retrieves them
function getAuthorizedClient() {
  if (oauthTokens) {
    return Promise.resolve(functionsOauthClient);
  }
  return admin.database().ref(DB_TOKEN_PATH).once('value').then((snapshot) => {
    oauthTokens = snapshot.val();
    functionsOauthClient.setCredentials(oauthTokens);
    return functionsOauthClient;
  });
}

// HTTPS function to write new data to CONFIG_DATA_PATH, for testing
exports.testsheetwrite = functions.https.onRequest((req, res) => {
  const random1 = Math.floor(Math.random() * 100);
  const random2 = Math.floor(Math.random() * 100);
  const random3 = Math.floor(Math.random() * 100);
  const ID = new Date().getUTCMilliseconds();
  return admin.database().ref(`${CONFIG_DATA_PATH}/${ID}`).set({
    firstColumn: random1,
    secondColumn: random2,
    thirdColumn: random3,
  }).then(() => res.status(200).send(
    `Wrote ${random1}, ${random2}, ${random3} to DB, trigger should now update Sheet.`));
});



exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({
        original: original
    }).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
    });
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original').onWrite((event) => {
  const original = event.data.val();
  const uppercase = original.toUpperCase();
 
  return event.data.ref.parent.child('uppercase').set(uppercase);
});