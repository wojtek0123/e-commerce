import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormFieldComponent } from '@e-commerce/client-web/shared/ui';
import { ActivatedRoute } from '@angular/router';
import { ContainerComponent } from '@e-commerce/client-web/auth/ui';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Message } from 'primeng/message';
import { LabelComponent } from '@e-commerce/client-web/shared/ui';
import { ErrorMessageDirective } from '@e-commerce/client-web/shared/utils';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    ContainerComponent,
    IftaLabelModule,
    Message,
    LabelComponent,
    ErrorMessageDirective,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'max-w-[30rem] w-full',
  },
})
export class LoginComponent {
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);

  public loading = this.authStore.loading;

  public loginForm = this.fb.group({
    email: this.fb.control<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  public submit() {
    Object.keys(this.loginForm.controls).forEach((control) =>
      this.loginForm.get(control)?.markAsDirty(),
    );

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authStore.login({ email: email ?? '', password: password ?? '' });
  }
}
