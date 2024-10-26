import { Route } from '@angular/router';
import { canMatchAuth } from '@e-commerce/client-web/shared/utils';

export const accountShellRoutes: Route[] = [
  {
    path: '',
    canMatch: [canMatchAuth],
    children: [
      {
        path: 'orders',
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/orders').then(
            (r) => r.ordersRoutes
          ),
      },
      {
        path: 'information',
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/information').then(
            (r) => r.informationRoutes
          ),
      },
      {
        path: '**',
        redirectTo: 'orders',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'orders',
  },
];
