import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, filter, tap } from 'rxjs';
import { EmailValidation, PasswordValidation } from '../../common/validations';
import { Role } from '../../enums/auth.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private subs = new SubSink();
  loginForm: FormGroup;
  loginError = '';
  redirectUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subs.sink = route.paramMap.subscribe(
      (params) => (this.redirectUrl = params.get('redirectUrl') ?? '')
    );
  }
  ngOnInit() {
    this.authService.logout();
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', EmailValidation],
      password: ['', PasswordValidation],
    });
  }

  async login(submittedForm: FormGroup) {
    this.authService
      .login(submittedForm.value.email, submittedForm.value.password)
      .pipe(catchError((err) => (this.loginError = err)));

    this.subs.sink = combineLatest([
      this.authService.authStatus$,
      this.authService.currentUser$,
    ])
      .pipe(
        filter(
          ([authStatus, user]) => authStatus.isAuthenticated && user?.id !== ''
        ),
        tap(([authStatus, user]) => {
          this.router.navigate([
            this.redirectUrl ||
              LoginComponent.homeRoutePerRole(user.role as Role),
          ]);
        })
      )
      .subscribe();
  }

  private static homeRoutePerRole(role: Role) {
    switch (role) {
      case Role.Manager:
        return '/manager';
      default:
        return '/user/profile';
    }
  }
}
