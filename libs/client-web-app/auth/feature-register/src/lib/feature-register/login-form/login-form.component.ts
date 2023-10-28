import { NgIf, AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { authActions } from '@e-commerce/client-web-app/auth/data-access-auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui-auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'e-commerce-login-form',
  templateUrl: './login-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormWrapperComponent,
    NgClass,
    ReactiveFormsModule,
  ],
})
export class LoginFormComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });
  submitted = false;

  onLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    this.store.dispatch(
      authActions.login({
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? '',
      })
    );
  }
}
