import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { selectIsAuthenticated } from '@e-commerce/client-web/auth/data-access';
import { Store } from '@ngrx/store';

export const canMatchAuth: CanMatchFn = () => {
  const router = inject(Router);
  const store = inject(Store);

  const isAuth = store.selectSignal(selectIsAuthenticated)();

  return (
    isAuth ||
    router.createUrlTree(['/login'], {
      queryParams: { 'redirect-to': 'order-process' },
    })
  );
};
