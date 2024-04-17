import { Route } from '@angular/router';
import { BaseLayoutComponent } from '@e-commerce/client-web-app/shell/ui';
import { authGuard } from '@e-commerce/client-web-app/shared/utils';
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
        canActivate: [authRouteGuard]
      },
      {
        path: 'cart',
        redirectTo: '/'
      }
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
