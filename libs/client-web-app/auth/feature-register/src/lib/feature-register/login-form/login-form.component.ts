import { NgIf, AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { selectLoginForm } from '@e-commerce/client-web-app/auth/data-access-auth';
import { NgrxFormsModule } from 'ngrx-forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { authActions } from '@e-commerce/client-web-app/auth/data-access-auth';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui-auth';

@Component({
  selector: 'e-commerce-login-form',
  templateUrl: './login-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    NgrxFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormWrapperComponent,
    NgClass,
  ],
})
export class LoginFormComponent implements OnInit {
  private store = inject(Store);

  form$ = this.store.select(selectLoginForm);

  ngOnInit() {
    this.store.dispatch(authActions.clearForm({ formId: 'login' }));
  }

  onLogin(isInvalid: boolean, isPristine: boolean) {
    if (isInvalid || isPristine) {
      this.store.dispatch(authActions.markFormAsSubmitted({ formId: 'login' }));
      return;
    }
    this.store.dispatch(authActions.login());
  }
}
