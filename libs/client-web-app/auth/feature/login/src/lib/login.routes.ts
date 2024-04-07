import { Route } from '@angular/router';

export const loginRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
];
