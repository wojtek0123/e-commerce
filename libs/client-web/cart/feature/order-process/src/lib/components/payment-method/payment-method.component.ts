import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  FormFieldComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form.component';
import { PaymentStore } from '@e-commerce/client-web/cart/data-access';
import { InputOtpModule } from 'primeng/inputotp';
import { SkeletonModule } from 'primeng/skeleton';
import { SixDigitCodeFormComponent } from './six-digit-code-form/six-digit-code-form.component';
import { PaymentMethod } from '@e-commerce/client-web/shared/data-access';
import { OrderProcessItemDirective } from '../../directives/order-process-item.directive';

@Component({
  selector: 'lib-payment-method',
  standalone: true,
  imports: [
    RadioButtonModule,
    FormFieldComponent,
    ErrorMessageComponent,
    NgClass,
    ButtonModule,
    OrderProcessItemDirective,
    CreditCardFormComponent,
    SectionWrapperComponent,
    InputOtpModule,
    SkeletonModule,
    SixDigitCodeFormComponent,
  ],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodComponent {
  private readonly paymentStore = inject(PaymentStore);

  public readonly debitCard: Extract<PaymentMethod, 'CREDIT_CARD'> =
    'CREDIT_CARD';
  public readonly sixDigitCode: Extract<PaymentMethod, 'SIX_DIGIT_CODE'> =
    'SIX_DIGIT_CODE';
  public selectedPaymentMethod = this.paymentStore.selectedPayment;
  public creditCard = this.paymentStore.creditCard;
  public loading = this.paymentStore.creditCard.loading;
  public payments = signal<PaymentMethod[]>(['CREDIT_CARD', 'SIX_DIGIT_CODE']);

  public selectPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentStore.selectPaymentMethod(paymentMethod);
  }
}
