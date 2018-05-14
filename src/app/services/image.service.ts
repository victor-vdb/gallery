import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import { GalleryImage, AlbumInfo } from '../models/galleryImage.model';
import * as firebase from 'firebase';

@Injectable()
export class ImageService {
  private uid: string;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) { 
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
      }
    });
  }

  getImages(albumId): Observable<GalleryImage[]> {
//    return this.db.list('uploads').valueChanges();
      
  return this.db.list('albums/' + albumId).snapshotChanges().take(1).map(actions => {
    return actions.map(action => ({ key: action.key, ...action.payload.val() }));
  });
      
  }
    
  getAlbums(): Observable<AlbumInfo[]> {
      
return this.db.list('albums').snapshotChanges().take(1).map(actions => {
    return actions.map(action => ({ key: action.key, ...action.payload.val() }));
  });
      
  }

  getImage(key: string) {
//    return firebase.database().ref('uploads/' + key).once('value')
//    .then((snap) => snap.val());
     return this.db.object('albums/AGj1epXx5Zty7YOaCG9e4aB6as-7GAm-NMuH4MpZZhtV2ap1kHYg/' + key).valueChanges().take(1);
  }
}