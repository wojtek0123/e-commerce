import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {
  AddressStore,
  CartStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

export const orderDetailsGuard: CanActivateFn = () => {
  const cartStore = inject(CartStore);
  const addressStore = inject(AddressStore);
  const shippingStore = inject(ShippingStore);
  const paymentStore = inject(PaymentStore);
  const appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  const router = inject(Router);

  const isOrderValid = [
    !!addressStore.selectedAddress(),
    !!shippingStore.selectedShipping(),
    !!paymentStore.selectedPayment(),
    !!paymentStore.sixDigitCode() || !!paymentStore.creditCard().data,
    cartStore.cartItems().length > 0,
  ].every((value) => value);

  return isOrderValid || router.createUrlTree([appRoutePaths.ORDER_PROCESS()]);
};
