import { Route } from '@angular/router';
import { OrderProcessComponent } from './order-process.component';
import {
  AddressStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';

export const orderProcessRoutes: Route[] = [
  {
    path: '',
    component: OrderProcessComponent,
    providers: [AddressStore, ShippingStore, PaymentStore, OrderProcessStore],
  },
];
