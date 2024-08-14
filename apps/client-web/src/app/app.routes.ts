import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import {
  AuthEffects,
  authFeature,
} from '@e-commerce/client-web/auth/data-access';

export const appRoutes: Route[] = [
  {
    path: 'auth',
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
    // providers: [
    //   provideState(authFeature.name, authFeature.reducer),
    //   provideEffects(AuthEffects),
    // ],
  },
];
