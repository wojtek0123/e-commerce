import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { resetAuthStatusResolver } from './shell/resetAuthStatus.resolver';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    resolve: [],
    children: [
      {
        path: 'login',
        resolve: { resetAuthStatusResolver },
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/login').then(
            (r) => r.loginRoutes
          ),
      },
      {
        path: 'register',
        resolve: { resetAuthStatusResolver },
        loadChildren: () =>
          import('@e-commerce/client-web-app/auth/feature/register').then(
            (r) => r.registerRoutes
          ),
      },
    ],
  },
];
