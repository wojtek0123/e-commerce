import { Route } from '@angular/router';
import { canMatchAuth } from './guards/auth.guard';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';
import { AuthShellComponent } from './auth-shell.component';

export const authShellRoutes: Route[] = [
  {
    path: '',
    canMatch: [canMatchAuth],
    component: AuthShellComponent,
    children: [
      {
        path: APP_ROUTES_FEATURE.AUTH.LOGIN,
        loadChildren: () =>
          import('@e-commerce/client-web/auth/feature/login').then(
            (r) => r.loginRoutes,
          ),
      },
      {
        path: APP_ROUTES_FEATURE.AUTH.REGISTER,
        loadChildren: () =>
          import('@e-commerce/client-web/auth/feature/register').then(
            (r) => r.registerRoutes,
          ),
      },
      {
        path: '**',
        redirectTo: APP_ROUTES_FEATURE.AUTH.LOGIN,
      },
    ],
  },
];
