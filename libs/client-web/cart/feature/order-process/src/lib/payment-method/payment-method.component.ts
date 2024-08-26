import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
  public submitted = signal(false);
  public payments = signal<PaymentMethod[]>(['credit-card', '6-digit-number']);
  public loading = this.store.selectSignal(
    orderProcessSelectors.selectCreditCardLoading,
  );

  public selectPaymentMethod(paymentMethod: PaymentMethod) {
    this.store.dispatch(
      orderProcessActions.selectPaymentMethod({ paymentMethod }),
    );
  }
}
