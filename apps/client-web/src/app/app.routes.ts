import { Route } from '@angular/router';

export const appRoutes: Route[] = [
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
];
