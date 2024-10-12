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
import {
  OrderProcessDetailElementComponent,
  SectionWrapperComponent,
} from '@e-commerce/client-web/cart/ui';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form.component';
import { PaymentStore } from '@e-commerce/client-web/cart/data-access';
import { InputOtpModule } from 'primeng/inputotp';
import { SkeletonModule } from 'primeng/skeleton';
import { SixDigitCodeFormComponent } from './six-digit-code-form/six-digit-code-form.component';
import { PaymentMethod } from '@prisma/client';

@Component({
  selector: 'lib-payment-method',
  standalone: true,
  imports: [
    RadioButtonModule,
    FormFieldComponent,
    ErrorMessageComponent,
    NgClass,
    ButtonModule,
    OrderProcessDetailElementComponent,
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

  public submitted = input.required<boolean>();

  public readonly debitCard: Extract<PaymentMethod, 'DEBIT_CARD'> =
    'DEBIT_CARD';
  public readonly sixDigitCode: Extract<PaymentMethod, 'SIX_DIGIT_NUMBER'> =
    'SIX_DIGIT_NUMBER';
  public selectedPaymentMethod = this.paymentStore.selectedPayment;
  public creditCard = this.paymentStore.creditCard;
  public loading = this.paymentStore.creditCard.loading;
  public payments = signal<PaymentMethod[]>(['DEBIT_CARD', 'SIX_DIGIT_NUMBER']);

  public selectPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentStore.selectPaymentMethod(paymentMethod);
  }
}
