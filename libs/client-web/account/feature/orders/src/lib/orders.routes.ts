import { Route } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrdersStore } from '@e-commerce/client-web/account/data-access';

export const ordersRoutes: Route[] = [{ path: '', component: OrdersComponent, providers: [OrdersStore]}];
