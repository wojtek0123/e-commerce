import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';
import {
  APP_QUERY_PARAMS,
  APP_ROUTE_PATHS_TOKEN,
} from '@e-commerce/client-web/shared/app-config';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  const redirectTo = route.data['redirectTo'] || null;

  const isAuth = authStore.isAuthenticated();

  return (
    isAuth ||
    router.createUrlTree([appRoutePaths.LOGIN()], {
      queryParams: {
        [APP_QUERY_PARAMS.REDIRECT_TO]: redirectTo,
      },
    })
  );
};
