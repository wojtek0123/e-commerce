import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import {
  cartSelectors,
  orderProcessActions,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';
import { DeliveryAddressComponent } from '../delivery-address/delivery-address.component';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { ShippingMethodComponent } from '../shipping-method/shipping-method.component';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-summary',
  standalone: true,
  imports: [
    CurrencyPipe,
    ButtonModule,
    DividerModule,
    DeliveryAddressComponent,
    PaymentMethodComponent,
    ShippingMethodComponent,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent implements OnInit {
  private readonly store = inject(Store);

  public cartItemsTotal = this.store.selectSignal(cartSelectors.selectTotal);
  public shippingMethodPrice = this.store.selectSignal(
    orderProcessSelectors.selectSelectedShippingMethodPrice,
  );
  public total = computed(
    () => this.cartItemsTotal() + this.shippingMethodPrice(),
  );

  public userAddress = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressData,
  );
  public shippingMethod = this.store.selectSignal(
    orderProcessSelectors.selectSelectedShippingMethod,
  );
  public paymentMethod = this.store.selectSignal(
    orderProcessSelectors.selectSelectedPaymentMethod,
  );
  public initialLoading = computed(
    () =>
      this.store.selectSignal(
        orderProcessSelectors.selectCreditCardLoading,
      )() ||
      this.store.selectSignal(
        orderProcessSelectors.selectUserAddressLoading,
      )() ||
      this.store.selectSignal(
        orderProcessSelectors.selectShippingMethodsLoading,
      )(),
  );
  public isSixDigitCodeInvalid = this.store.selectSignal(
    orderProcessSelectors.selectIsSixDigitCodeInvalid,
  );
  public isDeliveryAddressUpdating = signal(false);

  private errors = computed(() => [
    this.isSixDigitCodeInvalid,
    !!this.userAddress,
    !!this.shippingMethod,
    !!this.paymentMethod,
  ]);

  protected submitted = signal(false);

  ngOnInit(): void {
    this.store.dispatch(orderProcessActions.getCreditCard());
  }

  submit() {
    this.submitted.set(true);

    if (this.errors().some((error) => error)) return;

    console.log('pay');
  }

  setDeliveryAddressState(state: boolean) {
    this.isDeliveryAddressUpdating.set(state);
  }
}
