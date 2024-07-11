import { Route } from '@angular/router';
import { authGuard } from '@e-commerce/client-web-app/shared/data-access/guards';

export const shellRoutes: Route[] = [
  {
    path: '',
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./shell/shell.component').then((c) => c.ShellComponent),
    children: [
      {
        path: 'orders',
        loadChildren: () =>
          import('@e-commerce/client-web-app/user/feature/orders').then(
            (r) => r.ordersRoutes
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@e-commerce/client-web-app/user/feature/settings').then(
            (r) => r.settingsRoutes
          ),
      },
    ],
  },
];
