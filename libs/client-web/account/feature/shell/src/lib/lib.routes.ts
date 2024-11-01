import { Route } from '@angular/router';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';
import { canMatchAuth } from '@e-commerce/client-web/shared/utils';

export const accountShellRoutes: Route[] = [
  {
    path: '',
    canMatch: [canMatchAuth],
    children: [
      {
        path: APP_ROUTES_FEATURE.ACCOUNT.ORDERS,
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/orders').then(
            (r) => r.ordersRoutes,
          ),
      },
      {
        path: APP_ROUTES_FEATURE.ACCOUNT.INFORMATION,
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/information').then(
            (r) => r.informationRoutes,
          ),
      },
      {
        path: '**',
        redirectTo: APP_ROUTES_FEATURE.ACCOUNT.ORDERS,
      },
    ],
  },
];
