import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  FormFieldComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { ContainerComponent } from '@e-commerce/client-web/auth/ui';
import {
  canMatchPasswordValidator,
  createStrongPasswordValidator,
} from '@e-commerce/client-web/shared/utils';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgClass,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
    FloatLabelModule,
    FormFieldComponent,
    ErrorMessageComponent,
    ContainerComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'max-w-[30rem] w-full',
  },
})
export class RegisterComponent {
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);

  public loading = this.authStore.loading;

  public registerForm = this.fb.group(
    {
      email: this.fb.control<string | null>(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control<string | null>(null, {
        validators: [
          Validators.required,
          Validators.minLength(8),
          createStrongPasswordValidator(),
        ],
        nonNullable: true,
      }),
      confirmPassword: this.fb.control<string | null>(null, {
        validators: [Validators.required],
      }),
    },
    { validators: canMatchPasswordValidator('password', 'confirmPassword') },
  );

  public submit() {
    Object.keys(this.registerForm.controls).forEach((control) =>
      this.registerForm.get(control)?.markAsDirty(),
    );

    if (this.registerForm.invalid) return;

    const { email, password } = this.registerForm.value;

    this.authStore.register({ email: email ?? '', password: password ?? '' });
  }
}
