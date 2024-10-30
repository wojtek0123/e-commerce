import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {
  FormFieldComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from '@e-commerce/client-web/auth/ui';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'max-w-[30rem] w-full',
  },
})
export class LoginComponent {
  private readonly authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);

  public loading = this.authStore.loading;

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

    this.authStore.login({ email: email ?? '', password: password ?? '' });
  }
}
