import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  FormFieldComponent,
  LabelComponent,
} from '@e-commerce/client-web/shared/ui';
import { InputMaskModule } from 'primeng/inputmask';
import {
  PaymentStore,
  CreditCardFormType,
} from '@e-commerce/client-web/cart/data-access';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@e-commerce/client-web/shared/utils';

@Component({
  selector: 'lib-credit-card-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormFieldComponent,
    FormsModule,
    InputMaskModule,
    LabelComponent,
    Message,
    ErrorMessageDirective,
  ],
  templateUrl: './credit-card-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardFormComponent {
  private readonly paymentStore = inject(PaymentStore);

  public form = new FormGroup({
    cardNumber: new FormControl<string | null>(null, Validators.required),
    expirationDate: new FormControl<string | null>(null, Validators.required),
    securityCode: new FormControl<string | null>(null, Validators.required),
  });

  public formType = this.paymentStore.creditCardFormType;

  public showCreditCardForm(type: CreditCardFormType) {
    this.paymentStore.showCreditCardForm(type);
  }

  public hideCreditCardForm() {
    this.paymentStore.hideCreditCardForm();
  }

  public submit() {
    Object.keys(this.form.controls).forEach((control) =>
      this.form.get(control)?.markAsDirty(),
    );

    if (this.form.invalid) return;

    const { cardNumber, expirationDate, securityCode } = this.form.value;

    this.paymentStore.addCreditCard$({
      number: cardNumber ?? '',
      expirationDate: expirationDate ?? '',
      securityCode: securityCode ?? '',
    });
  }
}
