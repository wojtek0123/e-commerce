import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { resetAuthStatusResolver } from './shell/resetAuthStatus.resolver';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const shellRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: ShellComponent,
    resolve: [],
    children: [
      {
        path: appRouterConfig.auth.loginPath,
        resolve: { resetAuthStatusResolver },
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/login').then(
            (r) => r.loginRoutes
          ),
      },
      {
        path: appRouterConfig.auth.registerPath,
        resolve: { resetAuthStatusResolver },
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/register').then(
            (r) => r.registerRoutes
          ),
      },
    ],
  },
];
