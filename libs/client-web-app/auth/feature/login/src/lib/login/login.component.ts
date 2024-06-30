import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui/form-wrapper';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { getErrorMessage } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { Router } from '@angular/router';

@Component({
  selector: 'e-commerce-login',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormWrapperComponent,
    NgClass,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  constructor() {
    // effect(() => {
    //   this.errorMessage = getErrorMessage(this.status());
    //
    //   if (this.status() === 'ok') {
    //     this.router.navigate(['/']);
    //   }
    // });
  }

  // status = this.auth.status;
  // loading = this.authService.loading
  errorMessage: string | null = null;

  loginForm = this.fb.group({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur',
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: 'blur',
    }),
  });

  onSubmit() {
    const element = document.activeElement as
      | HTMLInputElement
      | HTMLButtonElement
      | undefined;

    element?.blur();
    const { valid } = this.loginForm;
    const { email, password } = this.loginForm.value;
    element?.focus();

    this.authService.login(email ?? '', password ?? '');
  }
}
