import { Route } from '@angular/router';
import { canMatchAuth } from '@e-commerce/client-web/auth/utils';

export const authShellRoutes: Route[] = [
  {
    path: '',
    canMatch: [canMatchAuth],
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('@e-commerce/client-web/auth/feature/login').then(
            (r) => r.loginRoutes
          ),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('@e-commerce/client-web/auth/feature/register').then(
            (r) => r.registerRoutes
          ),
      },
    ],
  },
];
