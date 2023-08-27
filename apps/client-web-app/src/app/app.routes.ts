import { Route } from '@angular/router';
import { browseFeatureRoutes } from '@e-commerce/client-web-app/browse/feature';
import { NxWelcomeComponent } from './nx-welcome.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: NxWelcomeComponent,
  },
  {
    path: 'product',
    children: browseFeatureRoutes,
  },
];
