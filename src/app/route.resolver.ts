import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ImageService } from './services/image.service';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class RouteResolver implements Resolve<Observable<string>> {
constructor(private imageService: ImageService) {}

  resolve(route: ActivatedRouteSnapshot) {
          return Observable.of(route.paramMap.get('imageId')).delay(0);
//    return this.imageService.getImages(route.paramMap.get('id'))
  }
}