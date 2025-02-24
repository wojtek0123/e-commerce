import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '@e-commerce/client-web/cart/api';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { MessageService } from 'primeng/api';
import { filter, map } from 'rxjs';

export const cartItemsGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cartService = inject(CartService);
  const messageService = inject(MessageService);
  const appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  const itemsCount = cartService.itemsCount;
  const loading$ = toObservable(cartService.loading);

  return loading$.pipe(
    filter((loading) => !loading),
    map(() => {
      if (itemsCount() === 0) {
        messageService.add({
          severity: 'info',
          detail:
            "Your card is empty that's why you don't have access to checkout",
          summary: 'No access',
          life: 5000,
        });
        return router.createUrlTree([appRoutePaths.BOOKS()]);
      } else {
        return true;
      }
    }),
  );
};
