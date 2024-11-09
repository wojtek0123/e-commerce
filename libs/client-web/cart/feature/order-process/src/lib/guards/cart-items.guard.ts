import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanMatchFn, Router } from '@angular/router';
import { CartService } from '@e-commerce/client-web/cart/api';
import { MessageService } from 'primeng/api';
import { filter, map, skipUntil } from 'rxjs';

export const cartItemsGuard: CanMatchFn = () => {
  const router = inject(Router);
  const cartService = inject(CartService);
  const messageService = inject(MessageService);
  const itemsCount = cartService.itemsCount;
  const loading$ = toObservable(cartService.loading);

  return loading$.pipe(
    skipUntil(loading$.pipe(filter((loading) => !loading))),
    map(() => {
      if (itemsCount() === 0) {
        messageService.add({
          severity: 'info',
          detail:
            "Your card is empty that's why you don't have access to checkout",
          summary: 'No access',
          life: 5000,
        });
        return router.createUrlTree(['/browse']);
      } else {
        return true;
      }
    }),
  );
};
