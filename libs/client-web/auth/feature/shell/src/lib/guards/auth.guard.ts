import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

export const canMatchAuth: CanMatchFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  const isAuth = authStore.isAuthenticated();

  return !isAuth || router.createUrlTree([appRoutePaths.HOME()]);
};
