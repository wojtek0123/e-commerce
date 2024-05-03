import { Route } from '@angular/router';
import { BaseLayoutComponent } from '@e-commerce/client-web-app/shell/ui';
import { authRouteGuard } from '@e-commerce/client-web-app/shell/utils';

export const clientWebAppShellRoutes: Route[] = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@e-commerce/client-web-app/products/feature-home').then(
            (r) => r.featureHomeRoutes
          ),
      },
      {
        path: 'ksiazki',
        loadChildren: () =>
          import('@e-commerce/client-web-app/browse/feature/books').then(
            (r) => r.booksRoutes
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('@e-commerce/client-web-app/products/feature-products').then(
            (r) => r.productsRoutes
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/shell').then(
            (r) => r.shellRoutes
          ),
        canActivate: [authRouteGuard],
      },
      {
        path: 'cart',
        redirectTo: '/',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
