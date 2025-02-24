import { Route } from '@angular/router';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';
import { authGuard } from '@e-commerce/client-web/shared/feature';

export const accountShellRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
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
        path: APP_ROUTES_FEATURE.ACCOUNT.FAVOURITE_BOOKS_LIST,
        loadChildren: () =>
          import(
            '@e-commerce/client-web/account/feature/favourite-books-list'
          ).then((r) => r.favouriteBooksListRoutes),
      },
      {
        path: '**',
        redirectTo: APP_ROUTES_FEATURE.ACCOUNT.ORDERS,
      },
    ],
  },
];
