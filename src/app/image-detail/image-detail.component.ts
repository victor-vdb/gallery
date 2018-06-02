import { Component, OnInit, OnChanges } from '@angular/core';
import { ImageService } from '../services/image.service';
import { ActivatedRoute } from '@angular/router';
import { GalleryImage } from '../models/galleryImage.model';
import { Observable } from 'rxjs/Observable';
import { MediaDetailResolverService } from '../services/media-detail-resolver.service';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit {
  image: Observable<GalleryImage>;
  url: string;
  loading: boolean = true;


  constructor(private imageService: ImageService,
    private route: ActivatedRoute) { }

  getImageUrl(album: string, image: string) {
    // this.image = this.imageService.getImage(key);
    this.image = this.imageService.getImage(album, image);
    this.image.subscribe(
      x => console.log('Observer got a next value: ' + x),
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    );
  }

  fadeImage() {
    this.loading = false;
  }

  ngOnInit() {
    this.route.data.subscribe((data: { media: GalleryImage }) => {
      // this.image = data.media;
      this.url = data.media.baseUrl;
      console.log(data.media);
    });
    // this.getImageUrl(this.route.snapshot.params['albumId'], this.route.snapshot.params['imageId']);
//    this.data = this.route.snapshot.data;
  }
}
