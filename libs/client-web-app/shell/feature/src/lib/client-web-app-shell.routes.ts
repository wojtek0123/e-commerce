import { Route } from '@angular/router';
import { BaseLayoutComponent } from '@e-commerce/client-web-app/shell/ui';
import { authRouteGuard } from '@e-commerce/client-web-app/shell/utils';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const clientWebAppShellRoutes: Route[] = [
  {
    path: appRouterConfig.defaultPath,
    component: BaseLayoutComponent,
    children: [
      {
        path: appRouterConfig.defaultPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/products/feature-home').then(
            (r) => r.featureHomeRoutes
          ),
      },
      {
        path: appRouterConfig.browse.basePath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/browse/feature/shell').then(
            (r) => r.shellRoutes
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
        path: appRouterConfig.auth.basePath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/shell').then(
            (r) => r.shellRoutes
          ),
        canActivate: [authRouteGuard],
      },
      {
        path: 'cart',
        redirectTo: appRouterConfig.defaultPath,
      },
      {
        path: '**',
        redirectTo: appRouterConfig.defaultPath,
      },
    ],
  },
  {
    path: '**',
    redirectTo: appRouterConfig.defaultPath,
  },
];
