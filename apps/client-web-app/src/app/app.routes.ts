import { Route } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@e-commerce/client-web-app/browsing/feature-home').then(
        (routes) => routes.featureHomeRoutes
      ),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@e-commerce/client-web-app/browsing/feature-products').then(
        (routes) => routes.productsRoutes
      ),
  },
  {
    path: 'product/details/:id',
    component: NxWelcomeComponent,
  },
  {
    path: 'register',
    component: NxWelcomeComponent,
  },
  {
    path: 'login',
    component: NxWelcomeComponent,
  },
];
