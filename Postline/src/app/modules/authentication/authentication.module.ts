import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterUserComponent } from '../../components/authentication/registration/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../../components/authentication/login/login.component';
import { ForgotPasswordComponent } from '../../components/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/authentication/reset-password/reset-password.component';

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
    ]),
  ],
})
export class AuthenticationModule {}
