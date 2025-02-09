import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  AddressStore,
  CartStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { DeliveryAddressComponent } from '../delivery-address/delivery-address.component';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { ShippingMethodComponent } from '../shipping-method/shipping-method.component';
import { DividerModule } from 'primeng/divider';
import { Message } from 'primeng/message';

@Component({
  selector: 'lib-summary',
  imports: [
    CurrencyPipe,
    ButtonModule,
    DividerModule,
    DeliveryAddressComponent,
    PaymentMethodComponent,
    ShippingMethodComponent,
    Message,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  #orderProcessStore = inject(OrderProcessStore);
  #cartStore = inject(CartStore);
  #addressStore = inject(AddressStore);
  #shippingStore = inject(ShippingStore);
  #paymentStore = inject(PaymentStore);

  cartItemsTotal = this.#cartStore.total;
  shippingMethodPrice = computed(
    () => this.#shippingStore.selectedShipping()?.price ?? 0,
  );
  total = computed(() => this.cartItemsTotal() + this.shippingMethodPrice());
  isCartEmpty = computed(() => this.#cartStore.cartItems().length === 0);

  selectedUserAddress = this.#addressStore.selectedAddress;
  selectedShippingMethod = this.#shippingStore.selectedShipping;
  selectedPaymentMethod = this.#paymentStore.selectedPayment;
  initialLoading = computed(
    () =>
      this.#addressStore.loading() ||
      this.#shippingStore.loading() ||
      this.#paymentStore.creditCard.loading(),
  );
  isSixDigitCodeInvalid = computed(
    () =>
      this.#paymentStore.sixDigitCode()?.length !== 6 &&
      this.selectedPaymentMethod() === 'SIX_DIGIT_CODE',
  );
  isAddressSelected = computed(() => !!this.#addressStore.selectedAddress());
  creditCard = this.#paymentStore.creditCard.data;
  isPaymentInvalid = signal(false);
  checkoutLoading = this.#orderProcessStore.loading;

  orderProcessErrors = computed(() => [
    !this.selectedUserAddress(),
    !this.selectedShippingMethod(),
    !this.selectedPaymentMethod(),
    this.isSixDigitCodeInvalid() || !this.creditCard,
    this.isCartEmpty(),
  ]);

  submitted = signal(false);

  submit() {
    this.submitted.set(true);

    const selectedUserAddress = this.selectedUserAddress();
    const selectedShippingMethod = this.selectedShippingMethod();
    const selectedPaymentMethod = this.selectedPaymentMethod();

    if (
      !selectedUserAddress ||
      !selectedShippingMethod ||
      !selectedPaymentMethod
    )
      return;

    const isOrderProcessInvalid = this.orderProcessErrors().some(
      (error) => !!error,
    );

    if (isOrderProcessInvalid) return;

    this.#orderProcessStore.checkout({
      orderAddress: selectedUserAddress,
      shippingMethodId: selectedShippingMethod.id,
      paymentMethod: selectedPaymentMethod,
    });
  }
}
