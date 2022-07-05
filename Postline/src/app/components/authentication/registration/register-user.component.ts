// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   FormControlName,
//   FormControl,
// } from '@angular/forms';
// import { SubSink } from 'subsink';
// import { AuthService } from '../../services/auth/auth.service';
// import { Router } from '@angular/router';
// import {
//   EmailValidation,
//   PasswordValidation,
//   RequiredTextValidation,
// } from '../../common/validations';
// import {
//   catchError,
//   combineLatest,
//   filter,
//   tap,
//   first,
//   distinctUntilChanged,
// } from 'rxjs';
// import { Role } from '../../enums/auth.enum';
// import { User } from '../../entities/user';
// import { debug, RxJsLoggingLevel } from '../../common/rxjsDebuger';
// import { UserForRegistration } from '../../entities/userForRegistration';
// import { AlertService } from '../../services/alert.service';
//
// @Component({
//   selector: 'app-registration',
//   templateUrl: './register-user.component.html',
//   styleUrls: ['./register-user.component.css'],
// })
// export class RegisterUserComponent implements OnInit {
//   private subs = new SubSink();
//   registrationForm: FormGroup;
//   emailIsTaken: boolean = true;
//   userNameIsTaken: boolean = true;
//   registrationError = '';
//   redirectUrl: string;
//
//   //#region for alert
//   options = {
//     autoClose: true,
//     keepAfterRouteChange: true,
//   };
//   //endregion
//
//   constructor(
//     public alertService: AlertService,
//     private formBuilder: FormBuilder,
//     private authService: AuthService,
//     private router: Router // private route: ActivatedRoute
//   ) {
//     // this.subs.sink = route.paramMap.subscribe(
//     //   (params) => (this.redirectUrl = params.get('redirectUrl') ?? '')
//     // );
//   }
//
//   ngOnInit() {
//     this.authService.logout();
//     this.buildLoginForm();
//   }
//
//   buildLoginForm() {
//     this.registrationForm = this.formBuilder.group({
//       firstName: ['', RequiredTextValidation],
//       lastName: ['', RequiredTextValidation],
//       email: ['', EmailValidation],
//       password: ['', PasswordValidation],
//       confirm: new FormControl(''),
//     });
//   }
//
//   onBlur(value: HTMLInputElement) {
//     if (value.checkValidity()) {
//       // console.log(
//       //   'Focus value: ' + value.value + ' and input name: ' + value.id
//       // );
//       if (value.id === 'email') {
//         this.authService
//           .checkEmail(value.value)
//           .pipe(
//             tap((val) => {
//               this.fillParams(val, 'email');
//             })
//           )
//           .subscribe();
//       } else {
//         this.authService
//           .checkName(value.value)
//           .pipe(
//             tap((val) => {
//               this.fillParams(val, 'userName');
//             })
//           )
//           .subscribe();
//       }
//     }
//   }
//
//   async register(submittedForm: FormGroup) {
//     if (!this.emailIsTaken && !this.userNameIsTaken) {
//       this.regUser(submittedForm);
//     } else {
//       this.alertService.warn(
//         `Please check your userName or email`,
//         this.options
//       );
//     }
//   }
//
//   private regUser(submittedForm: FormGroup) {
//     const { firstName, lastName, userName, email, password } =
//       submittedForm.value;
//
//     // Initialize User
//     const user = new UserForRegistration(
//       firstName,
//       lastName,
//       userName,
//       password,
//       email
//     );
//
//     const result = this.authService.registration(user).subscribe({
//       next: () => {
//         this.registrationError = 'Registration successful';
//         this.alertService.info(
//           `Registration successful ${firstName}.Please login in.`,
//           this.options
//         );
//         this.router.navigate(['/login']);
//       },
//       error: (error) => {
//         this.registrationError = error;
//       },
//     });
//   }
//
//   private fillParams(val: boolean, param: string) {
//     if (val) {
//       param === 'email'
//         ? (this.emailIsTaken = true)
//         : (this.userNameIsTaken = true);
//       this.registrationError = ` The ${param} is taken.Please choose a new one.\n `;
//
//       this.alertService.warn(
//         ` The ${param} is taken.Please choose a new one.`,
//         this.options
//       );
//
//       this.registrationForm.setErrors({ incorrect: true });
//     } else {
//       this.registrationError = '';
//       param === 'email'
//         ? (this.emailIsTaken = false)
//         : (this.userNameIsTaken = false);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControlName,
  FormControl,
  Validators,
} from '@angular/forms';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import {
  EmailValidation,
  PasswordValidation,
  RequiredTextValidation,
} from '../../../common/validations';
import {
  catchError,
  combineLatest,
  filter,
  tap,
  first,
  distinctUntilChanged,
} from 'rxjs';
import { Role } from '../../../enums/auth.enum';
import { User } from '../../../entities/user';
import { debug, RxJsLoggingLevel } from '../../../common/rxjsDebuger';
import { AlertService } from '../../../services/alert.service';
import { UserForRegistrationDto } from '../../../interfaces/user/userForRegistration';
import { HttpErrorResponse } from '@angular/common/http';
import { userRoutes } from '../../../routes/userRoutes';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { PasswordConfirmationValidatorService } from '../../../services/custom-validators/password-confirmation-validator.service';

@Component({
  selector: 'app-registration',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  public registrationForm: FormGroup;
  public emailIsTaken: boolean = true;
  public errorMessage: string = '';
  public showError: boolean;

  //#region for alert
  options = {
    autoClose: true,
    keepAfterRouteChange: true,
  };

  //endregion

  //#region ctor
  constructor(
    public alertService: AlertService,
    private authService: AuthenticationService,
    private router: Router,
    private passConfValidator: PasswordConfirmationValidatorService
  ) {}

  //endregion

  ngOnInit() {
    this.buildLoginForm();
    this.addConfirmValidator();
  }

  //#region Forms build, add validator, and validate
  buildLoginForm() {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation),
      confirm: new FormControl(''),
    });
  }

  addConfirmValidator() {
    this.registrationForm
      .get('confirm')
      ?.setValidators([
        Validators.required,
        this.passConfValidator.validateConfirmPassword(
          this.registrationForm.get('password')!
        ),
      ]);
  }

  public validateControl = (controlName: string) => {
    return (
      this.registrationForm.get(controlName)?.invalid &&
      this.registrationForm.get(controlName)?.touched
    );
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.registrationForm.get(controlName)?.hasError(errorName);
  };
  //endregion

  onBlur(value: HTMLInputElement) {
    if (value.checkValidity()) {
      this.authService
        .checkEmail(userRoutes.checkEmail, value.value)
        .pipe(
          tap((val) => {
            this.fillParams(val, 'email');
          })
        )
        .subscribe();
    }
  }

  private fillParams(val: boolean, param: string) {
    if (val) {
      this.alertService.warn(
        ` The ${param} is taken.Please choose a new one.`,
        this.options
      );
    } else {
      this.emailIsTaken = false;
    }
  }

  public registerUser = (registerFormValue: any) => {
    this.showError = false;
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
    };

    this.authService.registerUser(userRoutes.registration, user).subscribe({
      next: (_) => {
        this.router.navigate(['/authentication/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(err?.error?.errors, this.options);
        this.errorMessage = err.message;
        this.showError = true;
        console.log(err);
      },
    });
  };
}
