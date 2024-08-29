import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
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
import { Store } from '@ngrx/store';
import {
  orderProcessActions,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';

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
  private readonly store = inject(Store);

  public form = new FormGroup({
    cardNumber: new FormControl<string | null>(null, Validators.required),
    expirationDate: new FormControl<string | null>(null, Validators.required),
    securityCode: new FormControl<string | null>(null, Validators.required),
  });

  public submitted = signal(false);
  public creditCard = this.store.selectSignal(
    orderProcessSelectors.selectCreditCardData,
  );
  public loading = this.store.selectSignal(
    orderProcessSelectors.selectCreditCardLoading,
  );
  public error = this.store.selectSignal(
    orderProcessSelectors.selectCreditCardError,
  );
  changeCreditCard = signal(false);

  changeCreditCardUpdated = output<boolean>();

  submit() {
    this.submitted.set(true);

    if (this.form.invalid) return;

    if (this.changeCreditCard) {
      this.changeCreditCard.set(false);
    }

    const { cardNumber, expirationDate, securityCode } = this.form.value;

    this.store.dispatch(
      orderProcessActions.addCreditCard({
        data: {
          number: cardNumber!,
          expirationDate: expirationDate!,
          securityCode: securityCode!,
        },
      }),
    );
  }
}
