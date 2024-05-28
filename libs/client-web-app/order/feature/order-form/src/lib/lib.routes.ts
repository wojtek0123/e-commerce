import { Route } from '@angular/router';
import { OrderFormComponent } from './order-form/order-form.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const orderFormRoutes: Route[] = [
  { path: appRouterConfig.emptyPath, component: OrderFormComponent },
];
