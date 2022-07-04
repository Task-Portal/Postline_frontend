import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterUserComponent } from '../../components/registration/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../../components/login/login.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'register', component: RegisterUserComponent },
      { path: 'login', component: LoginComponent },
    ]),
  ],
})
export class AuthenticationModule {}
