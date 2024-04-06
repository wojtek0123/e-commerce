import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  authActions,
  authSelectors,
} from '@e-commerce/client-web-app/auth/data-access-auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui/form-wrapper';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { tap } from 'rxjs';
import { FloatLabelModule } from 'primeng/floatlabel';

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
  private store = inject(Store);
  private fb = inject(FormBuilder);

  status$ = this.store.select(authSelectors.selectStatus).pipe(
    tap((status) => {
      if (status === 'error') {
        this.loginForm.reset();
        this.emailInput?.nativeElement.focus();
        console.log(this.loginForm.getError('email'));
      }
    })
  );
  errorMessage$ = this.store.select(authSelectors.selectErrorMessage);

  @ViewChild('email') emailInput?: ElementRef;

  loginForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });

  onSubmit() {
    const { valid } = this.loginForm;
    const { email, password } = this.loginForm.value;

    this.store.dispatch(
      authActions.login({
        email: email ?? '',
        password: password ?? '',
        valid,
      })
    );
  }
}
