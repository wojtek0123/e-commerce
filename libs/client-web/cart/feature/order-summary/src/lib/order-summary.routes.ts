import { Route } from '@angular/router';
import { OrderSummaryComponent } from './order-summary.component';
import { orderDetailsGuard } from './guards/order-details.guard';

export const orderSummaryRoutes: Route[] = [
  {
    path: '',
    canActivate: [orderDetailsGuard],
    component: OrderSummaryComponent,
  },
];
