import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import { filter, map, skipUntil } from 'rxjs';

export const cartItemsGuard = () => {
  const router = inject(Router);
  const cartStore = inject(CartStore);
  const itemsCount = cartStore.itemsCount;
  const loading$ = toObservable(cartStore.loading);

  return loading$.pipe(
    skipUntil(
      loading$.pipe(filter((loading) => loading || itemsCount() !== 0)),
    ),
    map(() =>
      itemsCount() === 0 && !cartStore.loading()
        ? router.createUrlTree(['/browse'])
        : true,
    ),
  );
};
