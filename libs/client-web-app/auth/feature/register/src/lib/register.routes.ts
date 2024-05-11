import { Route } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const registerRoutes: Route[] = [
  { path: appRouterConfig.emptyPath, component: RegisterComponent },
];
