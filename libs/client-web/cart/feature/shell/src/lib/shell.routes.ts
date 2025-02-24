import { Route } from '@angular/router';
import {
  AddressStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';

export const cartShellRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: APP_ROUTES_FEATURE.CART.ORDER_PROCESS,
        loadChildren: () =>
          import('@e-commerce/client-web/cart/feature/order-process').then(
            (r) => r.orderProcessRoutes,
          ),
      },
      {
        path: APP_ROUTES_FEATURE.CART.PAYMENT_STATUS,
        loadChildren: () =>
          import('@e-commerce/client-web/cart/feature/payment-status').then(
            (r) => r.paymentStatusRoutes,
          ),
      },
      {
        path: APP_ROUTES_FEATURE.CART.ORDER_SUMMARY,
        loadChildren: () =>
          import('@e-commerce/client-web/cart/feature/order-summary').then(
            (r) => r.orderSummaryRoutes,
          ),
      },
      {
        path: '**',
        redirectTo: APP_ROUTES_FEATURE.CART.ORDER_PROCESS,
      },
    ],
    providers: [AddressStore, ShippingStore, PaymentStore, OrderProcessStore],
  },
];
