import { Route } from '@angular/router';
import {
  AddressStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
  CustomerInformationStore,
} from '@e-commerce/client-web/cart/data-access';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';

export const cartShellRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: APP_ROUTES_FEATURE.CART.ORDER_PROCESS,
        title: 'Order process | StoryStash',
        loadChildren: () =>
          import('@e-commerce/client-web/cart/feature/order-process').then(
            (r) => r.orderProcessRoutes,
          ),
      },
      {
        path: APP_ROUTES_FEATURE.CART.PAYMENT_STATUS,
        title: 'Payment status | StoryStash',
        loadChildren: () =>
          import('@e-commerce/client-web/cart/feature/payment-status').then(
            (r) => r.paymentStatusRoutes,
          ),
      },
      {
        path: APP_ROUTES_FEATURE.CART.ORDER_SUMMARY,
        title: 'Order summary | StoryStash',
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
    providers: [
      AddressStore,
      ShippingStore,
      PaymentStore,
      OrderProcessStore,
      CustomerInformationStore,
    ],
  },
];
