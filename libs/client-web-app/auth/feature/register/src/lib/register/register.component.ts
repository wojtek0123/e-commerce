import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { authActions } from '@e-commerce/client-web-app/auth/data-access-auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui/form-wrapper';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'e-commerce-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
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
