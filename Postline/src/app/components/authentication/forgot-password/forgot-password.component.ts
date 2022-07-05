import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ForgotPassword } from '../../../interfaces/user/forgotPassword';
import { environment } from '../../../../environments/environment';
import { userRoutes } from '../../../routes/userRoutes';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  successMessage: string;
  errorMessage: string;
  showSuccess: boolean;
  showError: boolean;
  constructor(private _authService: AuthenticationService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
    });
  }

  public forgotPassword = (forgotPasswordFormValue: any) => {
    this.showError = this.showSuccess = false;
    const forgotPass = { ...forgotPasswordFormValue };
    const forgotPassDto: ForgotPassword = {
      email: forgotPass.email,
      clientURL: `${environment.clientUrl}/authentication/resetpassword`,
    };
    console.log('forgotpasswordDto', forgotPassDto);
    this._authService
      .forgotPassword(userRoutes.forgotPassword, forgotPassDto)
      .subscribe({
        next: (_) => {
          this.showSuccess = true;
          this.successMessage =
            'The link has been sent, please check your email to reset your password.';
        },
        error: (err: HttpErrorResponse) => {
          this.showError = true;
          this.errorMessage = err.message;
        },
      });
  };
}
