import { Route } from '@angular/router';
import { AuthStore } from '@e-commerce/client-web/auth/data-access';

export const authShellRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('@e-commerce/client-web/auth/feature/login').then(
            (r) => r.loginRoutes,
          ),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('@e-commerce/client-web/auth/feature/register').then(
            (r) => r.registerRoutes,
          ),
      },
    ],
    providers: [AuthStore],
  },
];
