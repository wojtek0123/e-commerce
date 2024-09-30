import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  authActions,
  selectLoading,
} from '@e-commerce/client-web/auth/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {
  FormFieldComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContainerComponent } from '@e-commerce/client-web/auth/ui';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    NgClass,
    ReactiveFormsModule,
    FormFieldComponent,
    ErrorMessageComponent,
    ContainerComponent,
    AsyncPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly store = inject(Store);
  private fb = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);

  public loading$ = this.store.select(selectLoading);

  public loginForm = this.fb.nonNullable.group({
    email: this.fb.control<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  public onSubmit() {
    const { invalid } = this.loginForm;

    if (invalid) return;

    const { email, password } = this.loginForm.value;

    this.store.dispatch(
      authActions.login({ email: email ?? '', password: password ?? '' }),
    );
  }
}
