import { Component, OnInit, OnChanges } from '@angular/core';
import { ImageService } from '../services/image.service';
import { ActivatedRoute } from '@angular/router';
import { GalleryImage } from '../models/galleryImage.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent implements OnInit {
  imageUrl = '';
  image: Observable<GalleryImage>;
    
  data: any;

  constructor(private imageService: ImageService,
    private route: ActivatedRoute) { }

  getImageUrl(key: string) {
    this.image = this.imageService.getImage(key);
  }

  ngOnInit() {
    this.getImageUrl(this.route.snapshot.params['imageId']);
//    this.data = this.route.snapshot.data;
  }
}