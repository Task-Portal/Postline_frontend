import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { RegistrationComponent } from './components/registration/registration.component';
import { InternalServerComponent } from './components/error/internal-server/internal-server.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: '500', component: InternalServerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:redirectUrl', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
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
