import { Component, OnInit, OnChanges } from '@angular/core';
import { ImageService } from '../services/image.service';
import { AlbumInfo } from '../models/galleryImage.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit, OnChanges {
  albums: Observable<AlbumInfo[]>;

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.albums = this.imageService.getAlbums();
  }

  ngOnChanges() {
    this.albums = this.imageService.getAlbums();
  }
}
