import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function createStrongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);

    const hasLowerCase = /[a-z]+/.test(value);

    const hasNumeric = /[0-9]+/.test(value);

    const hasSpecial = /.*[!#$%&? "]/.test(value);

    const hasAtLeast8Characters = /.{8,}/.test(value);

    return {
      ...(!hasUpperCase && { uppercase: true }),
      ...(!hasLowerCase && { lowercase: true }),
      ...(!hasNumeric && { numeric: true }),
      ...(!hasAtLeast8Characters && { minlength: true }),
      ...(!hasSpecial && { special: true }),
    };
  };
}
