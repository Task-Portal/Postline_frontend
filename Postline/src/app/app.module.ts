//#region Imports
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {PageNotFoundComponent} from './components/authentication/page-not-found/page-not-found.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './components/authentication/login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RegisterUserComponent} from './components/authentication/registration/register-user.component';
import {AlertModule} from './modules/alert/alert.module';
import {InternalServerComponent} from './components/authentication/error/internal-server/internal-server.component';
import {PostDetailsComponent} from './components/posts/post-details/post-details.component';
import {ErrorHandlerService} from './services/error-handler.service';
import {JwtModule} from '@auth0/angular-jwt';
import {PrivacyComponent} from './components/authentication/privacy/privacy.component';
import {ForbiddenComponent} from './components/authentication/forbidden/forbidden.component';
import {ForgotPasswordComponent} from './components/authentication/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './components/authentication/reset-password/reset-password.component';
import {EmailConfirmationComponent} from './components/authentication/email-confirmation/email-confirmation.component';
import {
  TwoStepVerificationComponent
} from './components/authentication/two-step-verification/two-step-verification.component';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import {GoogleLoginProvider} from '@abacritt/angularx-social-login';

import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutComponent} from './components/layout/layout.component';
import {RoutingModule} from './modules/routing/routing.module';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './components/navigation/header/header.component';
import {SidenavListComponent} from './components/navigation/sidenav-list/sidenav-list.component';
import {SharedModule} from "./modules/shared/shared.module";
import { AccordionComponent } from './components/shared/accordion/accordion.component';

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
    PrivacyComponent,
    ForbiddenComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EmailConfirmationComponent,
    TwoStepVerificationComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavListComponent,
    AccordionComponent,

  ],
  imports: [
    BrowserModule,
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
    BrowserAnimationsModule,
    SharedModule,
    RoutingModule,
    RouterModule,

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
export class AppModule {
}
