import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';

export const canMatchAuth: CanMatchFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  const isAuth = authStore.isAuthenticated();

  return !isAuth || router.createUrlTree(['/']);
};
