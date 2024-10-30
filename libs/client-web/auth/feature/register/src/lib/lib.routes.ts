import { Route } from '@angular/router';

export const registerRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./register/register.component').then((c) => c.RegisterComponent),
  },
];
