import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const homeRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: HomeComponent,
  },
];
