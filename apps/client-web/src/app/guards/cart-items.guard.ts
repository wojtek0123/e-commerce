import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartStore } from '@e-commerce/client-web/cart/data-access';

export const cartItemsGuard = () => {
  const router = inject(Router);
  const itemsCount = inject(CartStore).itemsCount;

  return itemsCount() !== 0 || router.createUrlTree(['/browse']);
};
