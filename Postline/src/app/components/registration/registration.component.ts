import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControlName,
  FormControl,
} from '@angular/forms';
import { SubSink } from 'subsink';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import {
  EmailValidation,
  PasswordValidation,
  RequiredTextValidation,
} from '../../common/validations';
import {
  catchError,
  combineLatest,
  filter,
  tap,
  first,
  distinctUntilChanged,
} from 'rxjs';
import { Role } from '../../enums/auth.enum';
import { User } from '../../entities/user';
import { debug, RxJsLoggingLevel } from '../../common/rxjsDebuger';
import { UserForRegistration } from '../../entities/userForRegistration';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  private subs = new SubSink();
  registrationForm: FormGroup;
  emailIsTaken: boolean = true;
  userNameIsTaken: boolean = true;
  registrationError = '';
  redirectUrl: string;

  //#region for alert
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };
  //endregion

  constructor(
    public alertService: AlertService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router // private route: ActivatedRoute
  ) {
    // this.subs.sink = route.paramMap.subscribe(
    //   (params) => (this.redirectUrl = params.get('redirectUrl') ?? '')
    // );
  }

  ngOnInit() {
    this.authService.logout();
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', RequiredTextValidation],
      lastName: ['', RequiredTextValidation],
      userName: ['', RequiredTextValidation],
      email: ['', EmailValidation],
      password: ['', PasswordValidation],
    });
  }

  onBlur(value: HTMLInputElement) {
    if (value.checkValidity()) {
      // console.log(
      //   'Focus value: ' + value.value + ' and input name: ' + value.id
      // );
      if (value.id === 'email') {
        this.authService
          .checkEmail(value.value)
          .pipe(
            tap((val) => {
              this.fillParams(val, 'email');
            })
          )
          .subscribe();
      } else {
        this.authService
          .checkName(value.value)
          .pipe(
            tap((val) => {
              this.fillParams(val, 'userName');
            })
          )
          .subscribe();
      }
    }
  }

  async register(submittedForm: FormGroup) {
    if (!this.emailIsTaken && !this.userNameIsTaken) {
      this.regUser(submittedForm);
    } else {
      this.alertService.warn(
        `Please check your userName or email`,
        this.options
      );
    }
  }

  private regUser(submittedForm: FormGroup) {
    const { firstName, lastName, userName, email, password } =
      submittedForm.value;

    // Initialize User
    const user = new UserForRegistration(
      firstName,
      lastName,
      userName,
      password,
      email
    );

    const result = this.authService.registration(user).subscribe({
      next: () => {
        this.registrationError = 'Registration successful';
        this.alertService.info(
          `Registration successful ${firstName}.Please login in.`,
          this.options
        );
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.registrationError = error;
      },
    });
  }

  private fillParams(val: boolean, param: string) {
    if (val) {
      param === 'email'
        ? (this.emailIsTaken = true)
        : (this.userNameIsTaken = true);
      this.registrationError = ` The ${param} is taken.Please choose a new one.\n `;

      this.alertService.warn(
        ` The ${param} is taken.Please choose a new one.`,
        this.options
      );

      this.registrationForm.setErrors({ incorrect: true });
    } else {
      this.registrationError = '';
      param === 'email'
        ? (this.emailIsTaken = false)
        : (this.userNameIsTaken = false);
    }
  }
}
