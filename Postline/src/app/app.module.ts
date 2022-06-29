import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { CustomAuthService } from './services/auth/custom-auth.service';
import { LoginComponent } from './components/login/login.component';
import { AuthHttpInterceptor } from './services/auth/auth-http-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertModule } from './modules/alert/alert.module';
import { PostsRepositoryService } from './services/repositories/posts-repository.service';
import { InternalServerComponent } from './components/error/internal-server/internal-server.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegistrationComponent,
    InternalServerComponent,
    // AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AlertModule,
  ],
  providers: [
    {
      provide: AuthService,
      useClass: CustomAuthService,
      deps: [HttpClient],
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
