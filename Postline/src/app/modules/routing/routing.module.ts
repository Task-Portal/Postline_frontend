import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { InternalServerComponent } from '../../components/authentication/error/internal-server/internal-server.component';
import { PrivacyComponent } from '../../components/authentication/privacy/privacy.component';
import { AuthGuard } from '../../services/guards/auth.guard';
import { ManagerGuard } from '../../services/guards/manager.guard';
import { ForbiddenComponent } from '../../components/authentication/forbidden/forbidden.component';
import { PostDetailsComponent } from '../../components/posts/post-details/post-details.component';
import { LoginComponent } from '../../components/authentication/login/login.component';
import { PageNotFoundComponent } from '../../components/authentication/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '500', component: InternalServerComponent },
  {
    path: 'privacy',
    component: PrivacyComponent,
    canActivate: [AuthGuard, ManagerGuard],
  },
  { path: 'forbidden', component: ForbiddenComponent },
  {
    path: 'authentication',
    loadChildren: () =>
      import('../authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: 'post/:id', component: PostDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:redirectUrl', component: LoginComponent },
  {
    path: 'manager',
    loadChildren: () =>
      import('../manager/manager.module').then((m) => m.ManagerModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
})
export class RoutingModule {}
