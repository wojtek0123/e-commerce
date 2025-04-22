import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerInformationStore } from '@e-commerce/client-web/cart/data-access';
import {
  FormFieldComponent,
  LabelComponent,
} from '@e-commerce/client-web/shared/ui';
import { ErrorMessageDirective } from '@e-commerce/client-web/shared/utils';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';

@Component({
  selector: 'lib-customer-information-form',
  templateUrl: './customer-information-form.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormFieldComponent,
    LabelComponent,
    Message,
    Password,
    ErrorMessageDirective,
    Button,
    InputText,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInformationFormComponent {
  #customerInformationStore = inject(CustomerInformationStore);

  form = new FormGroup({
    firstName: new FormControl<string | null>(null, Validators.required),
    lastName: new FormControl<string | null>(null, Validators.required),
    phone: new FormControl<string | null>(null, Validators.required),
  });

  user = this.#customerInformationStore.user;
  loading = this.#customerInformationStore.loading;
  email = this.#customerInformationStore.email;
  isFormVisible = this.#customerInformationStore.isFormVisible;

  constructor() {
    effect(() => {
      const isDialogVisible = this.isFormVisible();
      const user = this.user();

      untracked(() => {
        if (!isDialogVisible)
          this.form.reset(
            {
              firstName: user?.userInformation?.firstName,
              lastName: user?.userInformation?.lastName,
              phone: user?.userInformation?.phone,
            },
            { emitEvent: false },
          );
      });
    });
  }

  hideForm() {
    this.#customerInformationStore.hideForm();
  }

  submit() {
    Object.keys(this.form.controls).forEach((control) => {
      this.form.get(control)?.markAsDirty();
    });

    if (this.form.invalid) return;

    const { firstName, lastName, phone } = this.form.value;

    this.#customerInformationStore.updateUser$({
      body: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
      },
    });
  }
}
