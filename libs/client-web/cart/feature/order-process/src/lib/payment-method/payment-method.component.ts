import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  FormFieldComponent,
  ErrorMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  OrderProcessDetailElementComponent,
  SectionWrapperComponent,
} from '@e-commerce/client-web/cart/ui';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form.component';

type Payment = 'credit-card' | '6-digit-number';

@Component({
  selector: 'lib-payment-method',
  standalone: true,
  imports: [
    RadioButtonModule,
    FormFieldComponent,
    ErrorMessageComponent,
    ReactiveFormsModule,
    NgClass,
    ButtonModule,
    OrderProcessDetailElementComponent,
    CreditCardFormComponent,
    SectionWrapperComponent,
  ],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodComponent {
  protected selectedPaymentMethod = new FormControl<Payment | null>(
    null,
    Validators.required,
  );

  public submitted = signal(false);
  public payments = signal<Payment[]>(['credit-card', '6-digit-number']);

  public selectPaymentMethod(method: Payment) {
    this.selectedPaymentMethod.setValue(method);
  }
}
