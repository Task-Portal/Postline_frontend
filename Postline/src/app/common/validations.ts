import { Validators } from '@angular/forms';

export const EmailValidation = [Validators.required, Validators.email];
export const PasswordValidation = [
  Validators.required,
  Validators.minLength(1),
  Validators.maxLength(50),
];

export const OptionalTextValidation = [
  Validators.minLength(2),
  Validators.maxLength(50),
];
export const RequiredTextValidation = OptionalTextValidation.concat([
  Validators.required,
]);
