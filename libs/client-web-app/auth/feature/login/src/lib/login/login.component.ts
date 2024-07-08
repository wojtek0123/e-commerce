import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui/form-wrapper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {
  FormRowComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web-app/shared/ui/form-row';

@Component({
  selector: 'e-commerce-login',
  standalone: true,
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormWrapperComponent,
    NgClass,
    ReactiveFormsModule,
    FormRowComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  loading = this.authService.loading;
  submitted = signal(false);

  loginForm = this.fb.nonNullable.group({
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
  });

  onSubmit() {
    this.submitted.set(true);
    const { invalid } = this.loginForm;

    if (invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email ?? '', password ?? '');
  }
}
