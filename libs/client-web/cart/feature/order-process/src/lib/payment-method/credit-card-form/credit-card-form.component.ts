import { Component, inject, OnInit, signal } from '@angular/core';
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
})
export class CreditCardFormComponent implements OnInit {
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

  ngOnInit(): void {
    this.store.dispatch(orderProcessActions.getCreditCard());
  }
}
