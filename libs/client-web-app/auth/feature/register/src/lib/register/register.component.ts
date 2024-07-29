import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui/form-wrapper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  FormFieldComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web-app/shared/ui/form-field';

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
    FormFieldComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);

  loading = this.authService.loading;
  submitted = signal(false);

  registerForm = this.fb.nonNullable.group(
    {
      email: this.fb.control<string>('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
        nonNullable: true,
      }),
      password: this.fb.control<string>('', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'blur',
        nonNullable: true,
      }),
      confirmPassword: this.fb.control<string>('', {
        validators: [Validators.required],
        updateOn: 'blur',
        nonNullable: true,
      }),
    },
    { validators: this.matchPassword() },
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
    this.submitted.set(true);

    if (this.registerForm.invalid) return;

    const { email, password } = this.registerForm.value;

    this.authService.register(email ?? '', password ?? '');
  }
}
