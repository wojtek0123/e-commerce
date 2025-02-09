import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AddressStore,
  CartStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

@Component({
  selector: 'lib-order-checkout',
  imports: [Message, Button],
  templateUrl: './order-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-base',
  },
})
export class OrderCheckoutComponent {
  #cartStore = inject(CartStore);
  #addressStore = inject(AddressStore);
  #shippingStore = inject(ShippingStore);
  #paymentStore = inject(PaymentStore);
  #orderProcessStore = inject(OrderProcessStore);

  selectedUserAddress = this.#addressStore.selectedAddress;
  selectedShippingMethod = this.#shippingStore.selectedShipping;
  selectedPaymentMethod = this.#paymentStore.selectedPayment;

  initialLoading = computed(
    () =>
      this.#addressStore.loading() ||
      this.#shippingStore.loading() ||
      this.#paymentStore.creditCard.loading(),
  );
  checkoutLoading = this.#orderProcessStore.loading;

  isCartEmpty = computed(() => this.#cartStore.cartItems().length === 0);
  isAddressSelected = computed(() => this.selectedUserAddress());
  isShippingMethodSelected = computed(() => this.selectedShippingMethod());
  isPaymentMethodSelected = computed(() => this.selectedPaymentMethod());
  isSixDigitCodeInvalid = computed(
    () =>
      this.#paymentStore.sixDigitCode()?.length !== 6 &&
      this.isPaymentMethodSelected() === 'SIX_DIGIT_CODE',
  );
  creditCard = this.#paymentStore.creditCard.data;

  isOrderInvalid = computed(() =>
    [
      !this.isAddressSelected(),
      !this.isShippingMethodSelected(),
      !this.isPaymentMethodSelected(),
      this.isSixDigitCodeInvalid() || !this.creditCard,
      this.isCartEmpty(),
    ].some((error) => !!error),
  );

  submitted = signal(false);

  submit() {
    this.submitted.set(true);

    const selectedUserAddress = this.selectedUserAddress();
    const selectedShippingMethod = this.selectedShippingMethod();
    const selectedPaymentMethod = this.selectedPaymentMethod();

    if (this.isOrderInvalid()) return;

    this.#orderProcessStore.checkout({
      orderAddress: selectedUserAddress!,
      shippingMethodId: selectedShippingMethod!.id,
      paymentMethod: selectedPaymentMethod!,
    });
  }
}
