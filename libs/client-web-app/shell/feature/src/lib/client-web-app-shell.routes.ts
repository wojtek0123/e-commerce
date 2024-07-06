import { Route } from '@angular/router';
import { authRouteGuard } from '@e-commerce/client-web-app/shell/utils';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { ShellComponent } from './shell.component';

export const clientWebAppShellRoutes: Route[] = [
  {
    path: appRouterConfig.order.basePath,
    loadChildren: () =>
      import('@e-commerce/client-web-app/order/feature/shell').then(
        (r) => r.shellRoutes
      ),
  },
  {
    path: appRouterConfig.emptyPath,
    component: ShellComponent,
    children: [
      {
        path: appRouterConfig.emptyPath,
        pathMatch: 'full',
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
        path: appRouterConfig.auth.basePath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/shell').then(
            (r) => r.shellRoutes
          ),
        canActivate: [authRouteGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('@e-commerce/client-web-app/user/feature/shell').then(
            (r) => r.shellRoutes
          ),
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
