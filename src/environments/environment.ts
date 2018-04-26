// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAjk9cg2-F1qC1Wpmj-uWX5pY4HFzm30Vo',
    authDomain: 'gallery-victorvdb.firebaseapp.com',
    databaseURL: 'https://gallery-victorvdb.firebaseio.com',
    projectId: 'gallery-victorvdb',
    storageBucket: 'gallery-victorvdb.appspot.com',
    messagingSenderId: '111393832285'
  }
};
