import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
import { TooltipModule } from 'primeng/tooltip';
import { canMatchPasswordValidator } from '@e-commerce/client-web/shared/utils';

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
    TooltipModule,
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

  public registerForm = this.fb.nonNullable.group(
    {
      email: this.fb.control<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: this.fb.control<string>('', {
        validators: [Validators.required, Validators.minLength(8)],
        nonNullable: true,
      }),
      confirmPassword: this.fb.control<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    { validators: canMatchPasswordValidator('password', 'confirmPassword') },
  );

  public onSubmit() {
    if (this.registerForm.invalid) return;

    const { email, password } = this.registerForm.value;

    this.authStore.register({ email: email ?? '', password: password ?? '' });
  }
}
