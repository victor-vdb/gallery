import { Component, OnInit, OnChanges, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '../services/image.service';
import { ActivatedRoute } from '@angular/router';
import { GalleryImage } from '../models/galleryImage.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges {
  images: Observable<GalleryImage[]>;
  albumId = this.route.snapshot.params['albumId'];

  constructor(private imageService: ImageService,
    private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://us-central1-gallery-victorvdb.cloudfunctions.net/getPhotos?albumId=' + this.route.snapshot.params['albumId'], {responseType: 'text'}).subscribe();
    this.images = this.imageService.getImages(this.route.snapshot.params['albumId']);
  }

  ngOnChanges() {
    this.images = this.imageService.getImages(this.route.snapshot.params['albumId']);
  }
}
