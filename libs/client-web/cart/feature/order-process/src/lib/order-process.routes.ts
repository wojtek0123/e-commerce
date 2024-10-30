import { Route } from '@angular/router';
import {
  AddressStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { cartItemsGuard } from './guards/cart-items.guard';

export const orderProcessRoutes: Route[] = [
  {
    path: '',
    canMatch: [cartItemsGuard],
    canActivate: [cartItemsGuard],
    loadComponent: () =>
      import('./order-process.component').then((c) => c.OrderProcessComponent),
    providers: [AddressStore, ShippingStore, PaymentStore, OrderProcessStore],
  },
];
