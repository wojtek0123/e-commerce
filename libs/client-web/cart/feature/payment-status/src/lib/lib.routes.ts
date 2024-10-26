import { Route } from '@angular/router';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { CartService } from '@e-commerce/client-web/cart/api';
import { CartStore } from '@e-commerce/client-web/cart/data-access';

export const paymentStatusRoutes: Route[] = [
  { path: '', component: PaymentStatusComponent, providers: [CartStore] },
];
