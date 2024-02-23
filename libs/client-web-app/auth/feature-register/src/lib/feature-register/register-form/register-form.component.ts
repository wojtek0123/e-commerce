import { NgIf, AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { authActions } from '@e-commerce/client-web-app/auth/data-access-auth';
import { RouterLink } from '@angular/router';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui-auth';

@Component({
  selector: 'e-commerce-register-form',
  templateUrl: './register-form.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgClass,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    FormWrapperComponent,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  submitted = false;
  registerForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    passwords: this.fb.group(
      {
        password: this.fb.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: this.fb.control('', [Validators.required]),
      },
      {
        validators: [this.matchPassword()],
      }
    ),
  });

  get passwordsControls() {
    return this.registerForm.controls.passwords.controls;
  }

  matchPassword() {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  onRegister() {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    this.store.dispatch(
      authActions.register({
        email: this.registerForm.value.email ?? '',
        password: this.registerForm.value.passwords?.password ?? '',
      })
    );
  }
}
