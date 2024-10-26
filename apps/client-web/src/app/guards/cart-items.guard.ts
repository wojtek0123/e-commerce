import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CartService } from '@e-commerce/client-web/cart/api';
import { filter, map, skipUntil } from 'rxjs';

export const cartItemsGuard = () => {
  const router = inject(Router);
  const cartService = inject(CartService);
  const itemsCount = cartService.itemsCount;
  const loading$ = toObservable(cartService.loading);

  return loading$.pipe(
    skipUntil(loading$.pipe(filter((loading) => !loading))),
    map(() => (itemsCount() === 0 ? router.createUrlTree(['/browse']) : true)),
  );
};
