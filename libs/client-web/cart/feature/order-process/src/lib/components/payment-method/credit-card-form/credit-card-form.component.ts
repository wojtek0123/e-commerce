import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
  ErrorMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { NgClass } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { PaymentStore } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-credit-card-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormFieldComponent,
    ErrorMessageComponent,
    NgClass,
    FormsModule,
    InputMaskModule,
  ],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardFormComponent {
  private readonly paymentStore = inject(PaymentStore);

  public form = new FormGroup({
    cardNumber: new FormControl<string | null>(null, Validators.required),
    expirationDate: new FormControl<string | null>(null, Validators.required),
    securityCode: new FormControl<string | null>(null, Validators.required),
  });

  public submitted = signal(false);
  public creditCard = this.paymentStore.creditCard.data;
  public loading = this.paymentStore.creditCard.loading;
  public error = this.paymentStore.creditCard.error;
  public isEditing = this.paymentStore.creditCard.isEditing;

  public toggleCreditCardEdit(isEditing: boolean) {
    this.paymentStore.toggleCreditCardEdit(isEditing);
  }

  public submit() {
    this.submitted.set(true);

    if (this.form.invalid) return;

    const { cardNumber, expirationDate, securityCode } = this.form.value;

    this.paymentStore.addCreditCard$({
      number: cardNumber ?? '',
      expirationDate: expirationDate ?? '',
      securityCode: securityCode ?? '',
    });
  }
}
