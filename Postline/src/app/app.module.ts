//#region Imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/authentication/page-not-found/page-not-found.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/authentication/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterUserComponent } from './components/authentication/registration/register-user.component';
import { AlertModule } from './modules/alert/alert.module';
import { InternalServerComponent } from './components/authentication/error/internal-server/internal-server.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { ErrorHandlerService } from './services/error-handler.service';
import { MenuComponent } from './components/menu/menu.component';
import { JwtModule } from '@auth0/angular-jwt';
import { PrivacyComponent } from './components/authentication/privacy/privacy.component';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { EmailConfirmationComponent } from './components/authentication/email-confirmation/email-confirmation.component';
import { TwoStepVerificationComponent } from './components/authentication/two-step-verification/two-step-verification.component';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { environment } from '../environments/environment';

//#endregion

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
    ForbiddenComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EmailConfirmationComponent,
    TwoStepVerificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AlertModule,
    SocialLoginModule,
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
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientIdForGoogle, {
              scope: 'email',
              plugin_name: environment.pluginNameForGoogle,
            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
