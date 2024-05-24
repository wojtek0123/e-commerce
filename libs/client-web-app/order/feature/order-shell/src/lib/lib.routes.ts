import { Route } from '@angular/router';
import { OrderShellComponent } from './shell/shell.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const orderShellRoutes: Route[] = [
  {
    path: '',
    component: OrderShellComponent,
    children: [
      {
        path: appRouterConfig.order.cartItemsPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/order/feature/cart-items').then(
            (r) => r.cartItemsRoutes
          ),
      },
      {
        path: appRouterConfig.order.deliveryAddressPath,
        loadChildren: () =>
          import(
            '@e-commerce/client-web-app/order/feature/delivery-address'
          ).then((r) => r.deliveryAddressRoutes),
      },
      {
        path: appRouterConfig.order.paymentPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/order/feature/payment').then(
            (r) => r.paymentRoutes
          ),
      },
      {
        path: appRouterConfig.order.summaryPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/order/feature/summary').then(
            (r) => r.summaryRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: appRouterConfig.order.cartItemsPath,
  },
];
