//#region Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterUserComponent } from '../../components/authentication/registration/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../../components/authentication/login/login.component';
import { ForgotPasswordComponent } from '../../components/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/authentication/reset-password/reset-password.component';
import { EmailConfirmationComponent } from '../../components/authentication/email-confirmation/email-confirmation.component';
import { TwoStepVerificationComponent } from 'src/app/components/authentication/two-step-verification/two-step-verification.component';
//#endregion

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'register', component: RegisterUserComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'resetpassword', component: ResetPasswordComponent },
      { path: 'emailconfirmation', component: EmailConfirmationComponent },
      { path: 'twostepverification', component: TwoStepVerificationComponent },
    ]),
  ],
})
export class AuthenticationModule {}
