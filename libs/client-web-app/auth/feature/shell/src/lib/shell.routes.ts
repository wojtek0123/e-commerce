import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { authGuard } from '@e-commerce/client-web-app/shared/data-access/guards';

export const shellRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: ShellComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: appRouterConfig.auth.loginPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/login').then(
            (r) => r.loginRoutes
          ),
      },
      {
        path: appRouterConfig.auth.registerPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/register').then(
            (r) => r.registerRoutes
          ),
      },
    ],
  },
];
