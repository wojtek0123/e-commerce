import { Route } from '@angular/router';
import { authRouteGuard } from '@e-commerce/client-web-app/shell/utils';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { CartItemsApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { ShellComponent } from './shell.component';
import { MessageService } from 'primeng/api';
import { ThemeSwitherService } from '@e-commerce/client-web-app/shell/data-access/theme-switcher';

export const clientWebAppShellRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: ShellComponent,
    providers: [CartItemsApiService, MessageService],
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
