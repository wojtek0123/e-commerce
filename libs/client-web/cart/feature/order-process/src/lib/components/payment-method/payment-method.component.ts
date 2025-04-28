import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import {
  SectionWrapperComponent,
  ToggleableContentComponent,
} from '@e-commerce/client-web/cart/ui';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form.component';
import { PaymentStore } from '@e-commerce/client-web/cart/data-access';
import { InputOtpModule } from 'primeng/inputotp';
import { SkeletonModule } from 'primeng/skeleton';
import { SixDigitCodeFormComponent } from './six-digit-code-form/six-digit-code-form.component';
import { PaymentMethod } from '@e-commerce/shared/api-models';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { DialogModule } from 'primeng/dialog';
import {
  ConfirmationDialogComponent,
  ErrorAndRetryMessageComponent,
} from '@e-commerce/client-web/shared/ui';

@Component({
  selector: 'lib-payment-method',
  imports: [
    RadioButtonModule,
    ButtonModule,
    OrderProcessItemDirective,
    CreditCardFormComponent,
    SectionWrapperComponent,
    InputOtpModule,
    SkeletonModule,
    SixDigitCodeFormComponent,
    DialogModule,
    ToggleableContentComponent,
    ErrorAndRetryMessageComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodComponent {
  #paymentStore = inject(PaymentStore);

  creditCardType: Extract<PaymentMethod, 'CREDIT_CARD'> = 'CREDIT_CARD';
  sixDigitCodeType: Extract<PaymentMethod, 'SIX_DIGIT_CODE'> = 'SIX_DIGIT_CODE';
  selectedPaymentMethod = this.#paymentStore.selectedPayment;
  creditCard = this.#paymentStore.creditCard;
  loading = this.#paymentStore.creditCard.loading;
  error = this.#paymentStore.creditCard.error;
  payments = signal([
    'CREDIT_CARD',
    'SIX_DIGIT_CODE',
  ] satisfies PaymentMethod[]);

  isDeleteDialogVisible = this.#paymentStore.creditCard.isDeleteDialogVisible;

  isCreditCardFormVisible = this.#paymentStore.isCreditCardFormVisible;
  creditCardFormType = this.#paymentStore.creditCardFormType;

  hideCreditCardForm() {
    this.#paymentStore.hideCreditCardForm();
  }

  showCreditCardForm(type: 'add' | 'update') {
    this.#paymentStore.showCreditCardForm(type);
  }

  selectPaymentMethod(paymentMethod: PaymentMethod) {
    this.#paymentStore.selectPaymentMethod(paymentMethod);
  }

  getCreditCard() {
    this.#paymentStore.getCreditCard();
  }

  toggleDeleteDialogConfirmation() {
    this.#paymentStore.toggleDeleteCreditCardConfirmation();
  }

  deleteCreditCard() {
    this.#paymentStore.deleteCreditCard();
  }
}
