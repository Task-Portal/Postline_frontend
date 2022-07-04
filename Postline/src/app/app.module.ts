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
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterUserComponent } from './components/registration/register-user.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertModule } from './modules/alert/alert.module';
import { PostsRepositoryService } from './services/repositories/posts-repository.service';
import { InternalServerComponent } from './components/error/internal-server/internal-server.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { ErrorHandlerService } from './services/error-handler.service';
import { MenuComponent } from './components/menu/menu.component';
import { JwtModule } from '@auth0/angular-jwt';
import { PrivacyComponent } from './components/privacy/privacy.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterUserComponent,
    InternalServerComponent,
    PostDetailsComponent,
    MenuComponent,
    PrivacyComponent,
    // AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AlertModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: ['localhost:44309'],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
