import { Routes } from '@angular/router';
import { RouteResolver } from './app/route.resolver';
import { GalleryComponent } from './app/gallery/gallery.component';
import { AlbumsComponent } from './app/albums/albums.component';
import { ImageDetailComponent } from './app/image-detail/image-detail.component';
import { LoginComponent } from './app/login/login.component';
import { UploadComponent } from './app/upload/upload.component';
import { AuthenticationGuard } from './app/services/authenticationGuard.service';

export const appRoutes: Routes = [
    { path: 'gallery/:albumId', component: GalleryComponent, canActivate: [AuthenticationGuard]},
    { path: 'albums', component: AlbumsComponent, canActivate: [AuthenticationGuard]},
    { path: 'upload', component: UploadComponent, canActivate: [AuthenticationGuard]},
    { path: 'image/:imageId', component: ImageDetailComponent, resolve: { message: RouteResolver }, canActivate: [AuthenticationGuard]},
    { path: '', redirectTo: '/albums', pathMatch: 'full'},
    { path: 'login', component: LoginComponent}
];