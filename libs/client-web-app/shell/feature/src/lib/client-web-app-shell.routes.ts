import { Route } from '@angular/router';
import { BaseLayoutComponent } from '@e-commerce/client-web-app/shell/ui';
import { authRouteGuard } from '@e-commerce/client-web-app/shell/utils';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const clientWebAppShellRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: BaseLayoutComponent,
    children: [
      {
        path: appRouterConfig.emptyPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/home/feature').then(
            (r) => r.homeRoutes
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
        redirectTo: appRouterConfig.emptyPath,
      },
      {
        path: '**',
        redirectTo: appRouterConfig.emptyPath,
      },
    ],
  },
  {
    path: '**',
    redirectTo: appRouterConfig.emptyPath,
  },
];
