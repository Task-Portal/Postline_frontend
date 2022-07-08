import { Component, OnInit } from '@angular/core';
import { TwoFactorDto } from 'src/app/interfaces/twoFactor/twoFactorDto';
import { AuthResponseDto } from '../../../interfaces/response/authResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { userRoutes } from '../../../routes/userRoutes';

@Component({
  selector: 'app-two-step-verification',
  templateUrl: './two-step-verification.component.html',
  styleUrls: ['./two-step-verification.component.css'],
})
export class TwoStepVerificationComponent implements OnInit {
  private provider: string;
  private email: string;
  private returnUrl: string;

  twoStepForm: FormGroup;
  showError: boolean;
  errorMessage: string;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.twoStepForm = new FormGroup({
      twoFactorCode: new FormControl('', [Validators.required]),
    });

    this.provider = this.route.snapshot.queryParams['provider'];
    this.email = this.route.snapshot.queryParams['email'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  loginUser = (twoStepFromValue: any) => {
    this.showError = false;

    const formValue = { ...twoStepFromValue };
    let twoFactorDto: TwoFactorDto = {
      email: this.email,
      provider: this.provider,
      token: formValue.twoFactorCode,
    };
    this.authService
      .twoStepLogin(userRoutes.twoStepVerification, twoFactorDto)
      .subscribe({
        next: (res: AuthResponseDto) => {
          localStorage.setItem('token', res.token);
          this.authService.sendAuthStateChangeNotification(
            res.isAuthSuccessful
          );
          this.router.navigate([this.returnUrl]);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
          this.showError = true;
        },
      });
  };
}
