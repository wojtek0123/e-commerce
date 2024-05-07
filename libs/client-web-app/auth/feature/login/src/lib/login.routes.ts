import { Route } from '@angular/router';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const loginRoutes: Route[] = [
  {
    path: appRouterConfig.defaultPath,
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
];
