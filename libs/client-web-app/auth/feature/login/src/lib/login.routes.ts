import { Route } from '@angular/router';
import { authFeature } from '@e-commerce/client-web-app/auth/data-access-auth';
import { provideState } from '@ngrx/store';

export const loginRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
];
