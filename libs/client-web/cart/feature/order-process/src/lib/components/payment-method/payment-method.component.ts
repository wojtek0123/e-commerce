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
import { PaymentMethod } from '@e-commerce/client-web/shared/data-access/api-models';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'lib-payment-method',
  standalone: true,
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
  ],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodComponent {
  private readonly paymentStore = inject(PaymentStore);

  public readonly creditCardType: Extract<PaymentMethod, 'CREDIT_CARD'> =
    'CREDIT_CARD';
  public readonly sixDigitCodeType: Extract<PaymentMethod, 'SIX_DIGIT_CODE'> =
    'SIX_DIGIT_CODE';
  public selectedPaymentMethod = this.paymentStore.selectedPayment;
  public creditCard = this.paymentStore.creditCard;
  public loading = this.paymentStore.creditCard.loading;
  public payments = signal<PaymentMethod[]>(['CREDIT_CARD', 'SIX_DIGIT_CODE']);

  public isCreditCardFormVisible = this.paymentStore.isCreditCardFormVisible;
  public creditCardFormType = this.paymentStore.creditCardFormType;

  public hideCreditCardForm() {
    this.paymentStore.hideCreditCardForm();
  }

  public showCreditCardForm(type: 'add' | 'update') {
    this.paymentStore.showCreditCardForm(type);
  }

  public selectPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentStore.selectPaymentMethod(paymentMethod);
  }
}
