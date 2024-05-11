import { Route } from '@angular/router';
import { FeatureComponent } from './feature/feature.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const homeRoutes: Route[] = [
  { path: appRouterConfig.emptyPath, component: FeatureComponent },
];
