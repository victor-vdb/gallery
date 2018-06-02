import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import { GalleryImage, AlbumInfo } from '../models/galleryImage.model';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';

@Injectable()
export class ImageService {
  private uid: string;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private afs: AngularFirestore) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
      }
    });
  }

  getImages(albumId): Observable<GalleryImage[]> {

    return this.afs.collection<GalleryImage>('albums/' + albumId + '/images').snapshotChanges().take(1).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { key: id, ...data };
      }))
    );

  // return this.db.list('albums/' + albumId).snapshotChanges().take(1).map(actions => {
  //   return actions.map(action => ({ key: action.key, ...action.payload.val() }));
  // });

  }

  getAlbums(): Observable<AlbumInfo[]> {

    return this.afs.collection<AlbumInfo>('albums').snapshotChanges().take(1).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { key: id, ...data };
      }))
    );

    // return this.db.list('albums').snapshotChanges().take(1).map(actions => {
    //     return actions.map(action => ({ key: action.key, ...action.payload.val() }));
    //   });

  }

  getImage(album: string, image: string): Observable<GalleryImage> {

    return this.afs.doc<GalleryImage>('albums/' + album + '/images/' + image).valueChanges().take(1);

     // return this.db.object('albums/AGj1epXx5Zty7YOaCG9e4aB6as-7GAm-NMuH4MpZZhtV2ap1kHYg/' + key).valueChanges().take(1);
  }
}
