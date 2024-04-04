import { Route } from '@angular/router';
import { BaseLayoutComponent } from '@e-commerce/client-web-app/shell/ui';

export const clientWebAppShellRoutes: Route[] = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@e-commerce/client-web-app/products/feature-home').then(
            (routes) => routes.featureHomeRoutes
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('@e-commerce/client-web-app/products/feature-products').then(
            (routes) => routes.productsRoutes
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature-register').then(
            (routes) => routes.featureRegisterRoutes
          ),
      },
    ],
  },
];
