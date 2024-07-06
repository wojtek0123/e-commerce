import { Route } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsApiService } from '@e-commerce/client-web-app/user/data-access';

export const ordersRoutes: Route[] = [
  { path: '', component: OrdersComponent, providers: [OrderDetailsApiService] },
];
