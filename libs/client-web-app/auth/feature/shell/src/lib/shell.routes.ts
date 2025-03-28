import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import {
  AuthService,
  authEffects,
  authFeature,
} from '@e-commerce/client-web-app/auth/data-access';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/login').then(
            (r) => r.loginRoutes
          ),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/register').then(
            (r) => r.registerRoutes
          ),
      },
    ],
    providers: [
      provideState(authFeature),
      provideEffects([authEffects]),
      AuthService,
    ],
  },
];
