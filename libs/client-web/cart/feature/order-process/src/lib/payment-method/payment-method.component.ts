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
import { Store } from '@ngrx/store';
import {
  orderProcessActions,
  orderProcessSelectors,
  PaymentMethod,
} from '@e-commerce/client-web/cart/data-access';
import { InputOtpModule } from 'primeng/inputotp';
import { SkeletonModule } from 'primeng/skeleton';
import { SixDigitCodeFormComponent } from './six-digit-code-form/six-digit-code-form.component';

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
  private readonly store = inject(Store);

  public selectedPaymentMethod = this.store.selectSignal(
    orderProcessSelectors.selectSelectedPaymentMethod,
  );
  public creditCard = this.store.selectSignal(
    orderProcessSelectors.selectCreditCardData,
  );
  public submitted = input.required<boolean>();
  public payments = signal<PaymentMethod[]>(['credit-card', '6-digit-code']);
  public loading = this.store.selectSignal(
    orderProcessSelectors.selectCreditCardLoading,
  );

  public selectPaymentMethod(paymentMethod: PaymentMethod) {
    this.store.dispatch(
      orderProcessActions.selectPaymentMethod({ paymentMethod }),
    );
  }
}
