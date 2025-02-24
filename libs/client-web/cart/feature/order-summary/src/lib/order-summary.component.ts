import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AddressStore,
  CartStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import {
  CartItemsComponent,
  OrderContainerComponent,
  OrderPriceComponent,
  SectionWrapperComponent,
} from '@e-commerce/client-web/cart/ui';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { AddressInformationComponent } from '@e-commerce/client-web/shared/ui';
import { PaymentMethod } from '@e-commerce/shared/api-models';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-order-summary',
  imports: [
    CartItemsComponent,
    OrderContainerComponent,
    AddressInformationComponent,
    SectionWrapperComponent,
    Button,
    CurrencyPipe,
    OrderPriceComponent,
  ],
  templateUrl: './order-summary.component.html',
})
export class OrderSummaryComponent {
  #cartStore = inject(CartStore);
  #addressStore = inject(AddressStore);
  #shippingStore = inject(ShippingStore);
  #paymentStore = inject(PaymentStore);
  #orderProcessStore = inject(OrderProcessStore);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  #router = inject(Router);

  cartItems = this.#cartStore.cartItems;
  cartTotal = this.#cartStore.total;
  cartItemsLoading = this.#cartStore.loading;
  booksUrl = this.#appRoutePaths.BOOKS();

  selectedUserAddress = this.#addressStore.selectedAddress;
  selectedShippingMethod = this.#shippingStore.selectedShipping;
  selectedPaymentMethod = this.#paymentStore.selectedPayment;
  loading = this.#orderProcessStore.loading;

  creditCardType: Extract<PaymentMethod, 'CREDIT_CARD'> = 'CREDIT_CARD';
  sixDigitCodeType: Extract<PaymentMethod, 'SIX_DIGIT_CODE'> = 'SIX_DIGIT_CODE';

  creditCard = computed(() => this.#paymentStore.creditCard().data);

  submitted = signal(false);

  edit() {
    this.#router.navigate([this.#appRoutePaths.ORDER_PROCESS()]);
  }

  checkout() {
    this.submitted.set(true);

    const selectedUserAddress = this.selectedUserAddress();
    const selectedShippingMethod = this.selectedShippingMethod();
    const selectedPaymentMethod = this.selectedPaymentMethod();

    if (
      !selectedUserAddress ||
      !selectedPaymentMethod ||
      !selectedShippingMethod
    ) {
      throw new Error('Some order information are missing');
    }

    this.#orderProcessStore.checkout({
      orderAddress: selectedUserAddress,
      shippingMethodId: selectedShippingMethod.id,
      paymentMethod: selectedPaymentMethod,
    });
  }
}
