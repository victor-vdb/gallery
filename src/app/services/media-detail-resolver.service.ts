import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GalleryImage, AlbumInfo } from '../models/galleryImage.model';
import { ImageService } from './image.service';

@Injectable()
export class MediaDetailResolverService implements Resolve<GalleryImage> {

  constructor(private is: ImageService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GalleryImage> {
      let albumId = route.paramMap.get('albumId');
      let imageId = route.paramMap.get('imageId');

      return this.is.getImage(albumId, imageId).pipe(
        take(1),
        map(image => {
          if (image) {
            return image;
          } else { // id not found
            this.router.navigate(['']);
            return null;
          }
        })
      );
    }

}
