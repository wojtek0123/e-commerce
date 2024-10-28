import { Route } from '@angular/router';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import { paymentStatusGuard } from './guards/payment-status.guard';
import { cartItemsGuard } from './guards/cart-items.guard';
import { canMatchAuth } from '@e-commerce/client-web/shared/utils';

export const clientWebCartFeatureShellRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'order-process',
        canMatch: [canMatchAuth],
        canActivate: [cartItemsGuard],
        loadChildren: () =>
          import('@e-commerce/client-web/cart/feature/order-process').then(
            (r) => r.orderProcessRoutes
          ),
      },
      {
        path: 'payment-status/:order-details-id',
        canMatch: [paymentStatusGuard],
        loadChildren: () =>
          import('@e-commerce/client-web/cart/feature/payment-status').then(
            (r) => r.paymentStatusRoutes
          ),
      },
    ],
    providers: [CartStore],
  },
];
