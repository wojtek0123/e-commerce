import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AddressStore,
  CartStore,
  CustomerInformationStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
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
  #customerInformationStore = inject(CustomerInformationStore);
  #router = inject(Router);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  selectedUserAddress = this.#addressStore.selectedAddress;
  selectedShippingMethod = this.#shippingStore.selectedShipping;
  selectedPaymentMethod = this.#paymentStore.selectedPayment;
  user = this.#customerInformationStore.user;

  loading = computed(
    () =>
      this.#addressStore.loading() ||
      this.#shippingStore.loading() ||
      this.#paymentStore.creditCard.loading(),
  );

  isCustomerInformationInvalid = computed(() => {
    const user = this.user();

    return [
      user?.userInformation?.firstName ?? null,
      user?.userInformation?.lastName ?? null,
      user?.userInformation?.phone ?? null,
    ].some((value) => !value);
  });
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

  isCreditCardSelectedAndCreditCardDataAreNotProvided = computed(
    () => this.selectedPaymentMethod() === 'CREDIT_CARD' && !this.creditCard(),
  );

  isOrderInvalid = computed(() =>
    [
      !this.isAddressSelected(),
      !this.isShippingMethodSelected(),
      !this.isPaymentMethodSelected(),
      this.isCreditCardSelectedAndCreditCardDataAreNotProvided(),
      this.isCustomerInformationInvalid(),
      this.isSixDigitCodeInvalid() || !this.creditCard,
      this.isCartEmpty(),
    ].some((error) => !!error),
  );

  submitted = signal(false);

  submit() {
    this.submitted.set(true);

    if (this.isOrderInvalid()) return;

    this.#router.navigate([this.#appRoutePaths.ORDER_SUMMARY()]);
  }
}
