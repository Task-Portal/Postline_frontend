import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/authentication/page-not-found/page-not-found.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterUserComponent } from './components/authentication/registration/register-user.component';
import { InternalServerComponent } from './components/authentication/error/internal-server/internal-server.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { PrivacyComponent } from './components/authentication/privacy/privacy.component';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';
import { AuthGuard } from './services/guards/auth.guard';
import { ManagerGuard } from './services/guards/manager.guard';

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
      import('./modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: 'post/:id', component: PostDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:redirectUrl', component: LoginComponent },
  // { path: 'registration', component: RegisterUserComponent },
  {
    path: 'manager',
    loadChildren: () =>
      import('./modules/manager/manager.module').then((m) => m.ManagerModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
