import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ShoppingSessionApiService } from 'libs/client-web-app/shared/data-access/cart/src/lib/services/shopping-session-api.service';
import { map } from 'rxjs';

export const isCartEmptyGuard: CanActivateFn = () => {
  const shoppingSessionApi = inject(ShoppingSessionApiService);
  const router = inject(Router);

  // TODO: przy inicjalizacji itemy z koszyka są pobrane po sprawdzeniu w tym guardzie, więc zawsze jest false

  // TODO: co z niezalogowanym użytkownikiem
  return shoppingSessionApi
    .getShoppingSession()
    .pipe(
      map(
        (session) => !!session.cartItems.length || router.createUrlTree(['/']),
      ),
    );
};
