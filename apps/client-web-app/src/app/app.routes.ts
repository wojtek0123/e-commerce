import { Route } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: NxWelcomeComponent,
  },
  {
    path: 'products',
    component: NxWelcomeComponent,
  },
  {
    path: 'product/details/:id',
    component: NxWelcomeComponent,
  },
];
