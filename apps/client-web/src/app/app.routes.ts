import { Route } from '@angular/router';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';

export const appRoutes: Route[] = [
  {
    path: APP_ROUTES_FEATURE.HOME.BASE,
    loadChildren: () =>
      import('@e-commerce/client-web/home/feature').then((r) => r.homeRoutes),
  },
  {
    path: APP_ROUTES_FEATURE.AUTH.BASE,
    loadChildren: () =>
      import('@e-commerce/client-web/auth/feature/shell').then(
        (r) => r.authShellRoutes,
      ),
  },
  {
    path: APP_ROUTES_FEATURE.BROWSE.BASE,
    loadChildren: () =>
      import('@e-commerce/client-web/browse/feature/shell').then(
        (r) => r.browseShellRoutes,
      ),
  },
  {
    path: APP_ROUTES_FEATURE.CART.BASE,
    loadChildren: () =>
      import('@e-commerce/client-web/cart/feature/shell').then(
        (r) => r.cartShellRoutes,
      ),
  },
  {
    path: APP_ROUTES_FEATURE.ACCOUNT.BASE,
    loadChildren: () =>
      import('@e-commerce/client-web/account/feature/shell').then(
        (r) => r.accountShellRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: `/${APP_ROUTES_FEATURE.HOME.BASE}`,
  },
];
