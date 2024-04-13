import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  authActions,
  authSelectors,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui/form-wrapper';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'e-commerce-register',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgClass,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    FormWrapperComponent,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  status$ = this.store.select(authSelectors.selectStatus);
  errorMessage$ = this.store.select(authSelectors.selectErrorMessage);

  registerForm = this.fb.group(
    {
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'blur',
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
    },
    { validators: this.matchPassword() }
  );

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

  onSubmit() {
    const element = document.activeElement as
      | HTMLInputElement
      | HTMLButtonElement
      | undefined;

    element?.blur();
    const { valid } = this.registerForm;
    const { email, password } = this.registerForm.value;
    element?.focus();

    this.store.dispatch(
      authActions.register({
        email: email ?? '',
        password: password ?? '',
        valid,
      })
    );
  }
}
