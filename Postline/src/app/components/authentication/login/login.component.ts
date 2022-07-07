import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EmailValidation,
  PasswordValidation,
} from '../../../common/validations';
import { Role } from '../../../enums/auth.enum';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { UserForAuthenticationDto } from '../../../interfaces/user/userForAuthenticationDto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponseDto } from '../../../interfaces/response/authResponseDto';
import { userRoutes } from '../../../routes/userRoutes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private returnUrl: string;
  loginForm: FormGroup;
  errorMessage: string = '';
  showError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.buildLoginForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidation],
    });
  }

  loginUser = (loginFormValue: any) => {
    this.showError = false;
    const login = { ...loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.email,
      password: login.password,
    };
    this.authService.loginUser(userRoutes.login, userForAuth).subscribe({
      next: (res: AuthResponseDto) => {
        console.log(`Login User. Token got ${res.token}`);
        localStorage.setItem('token', res.token);
        this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this.router.navigate([this.returnUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };

  private static homeRoutePerRole(role: Role) {
    switch (role) {
      case Role.Manager:
        return '/manager';
      default:
        return '/user/profile';
    }
  }
}
