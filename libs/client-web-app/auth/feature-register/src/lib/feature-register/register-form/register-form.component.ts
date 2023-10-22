import { NgIf, AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { NgrxFormsModule } from 'ngrx-forms';
import { selectRegisterForm } from '@e-commerce/client-web-app/auth/data-access-auth';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { authActions } from '@e-commerce/client-web-app/auth/data-access-auth';
import { RouterLink } from '@angular/router';
import { FormWrapperComponent } from '@e-commerce/client-web-app/auth/ui-auth';

@Component({
  selector: 'e-commerce-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgClass,
    InputTextModule,
    NgrxFormsModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    FormWrapperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent implements OnInit {
  private store = inject(Store);

  @Output() clickEvent = new EventEmitter<void>();
  @HostBinding('class') class = 'max-w-20rem w-full';

  form$ = this.store.select(selectRegisterForm);

  ngOnInit(): void {
    this.store.dispatch(authActions.clearForm({ formId: 'register' }));
  }

  onRegister(isInvalid: boolean, isPristine: boolean) {
    if (isInvalid || isPristine) {
      this.store.dispatch(
        authActions.markFormAsSubmitted({ formId: 'register' })
      );
      return;
    }
    this.store.dispatch(authActions.register());
  }
}
