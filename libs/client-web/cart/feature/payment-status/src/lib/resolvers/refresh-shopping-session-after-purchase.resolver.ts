import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CartStore } from '@e-commerce/client-web/cart/data-access';

export const refreshShoppingSessionAfterPurchaseResolver: ResolveFn<
  void
> = () => {
  const cartStore = inject(CartStore);

  cartStore.getNewShoppingSessionAfterPurchase();

  return undefined;
};
