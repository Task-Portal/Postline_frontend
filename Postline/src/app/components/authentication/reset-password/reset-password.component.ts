import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { PasswordConfirmationValidatorService } from '../../../services/custom-validators/password-confirmation-validator.service';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordDto } from '../../../interfaces/user/ResetPasswordDto';
import { HttpErrorResponse } from '@angular/common/http';
import { userRoutes } from '../../../routes/userRoutes';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  showSuccess: boolean;
  showError: boolean;
  errorMessage: string;
  private token: string;
  private email: string;

  constructor(
    private authService: AuthenticationService,
    private passConfValidator: PasswordConfirmationValidatorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.addConfirmationValidator();

    this.token = this.route.snapshot.queryParams['token'];
    this.email = this.route.snapshot.queryParams['email'];
  }

  buildForm() {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl(''),
    });
  }

  addConfirmationValidator() {
    this.resetPasswordForm
      .get('confirm')
      ?.setValidators([
        Validators.required,
        this.passConfValidator.validateConfirmPassword(
          this.resetPasswordForm.get('password')!
        ),
      ]);
  }

  public resetPassword = (resetPasswordFormValue: any) => {
    this.showError = this.showSuccess = false;
    const resetPass = { ...resetPasswordFormValue };
    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this.token,
      email: this.email,
    };
    this.authService
      .resetPassword(userRoutes.resetPassword, resetPassDto)
      .subscribe({
        next: (_) => (this.showSuccess = true),
        error: (err: HttpErrorResponse) => {
          this.showError = true;
          this.errorMessage = err.message;
        },
      });
  };
}
