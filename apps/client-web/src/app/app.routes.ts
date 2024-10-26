import { Route } from '@angular/router';
import { OrdersStore } from '@e-commerce/client-web/account/data-access';
import { canMatchAuth } from './guards/auth.guard';
import { cartItemsGuard } from './guards/cart-items.guard';
import { paymentStatusGuard } from './guards/payment-status.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@e-commerce/client-web/home/feature').then(
            (r) => r.homeRoutes,
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('@e-commerce/client-web/auth/feature/shell').then(
            (r) => r.authShellRoutes,
          ),
      },
    ],
  },
  {
    path: 'browse',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('@e-commerce/client-web/browse/feature/books').then(
            (r) => r.booksRoutes,
          ),
      },
    ],
  },
  {
    path: 'book/:bookId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('@e-commerce/client-web/browse/feature/book').then(
            (r) => r.bookRoutes,
          ),
      },
    ],
  },
  {
    path: 'order-process',
    canMatch: [canMatchAuth],
    canActivate: [cartItemsGuard],
    loadChildren: () =>
      import('@e-commerce/client-web/cart/feature/order-process').then(
        (r) => r.orderProcessRoutes,
      ),
  },
  {
    path: 'payment-status/:order-details-id',
    // TODO: canMatch guard to check if user ordered and pay
    canMatch: [paymentStatusGuard],
    loadChildren: () =>
      import('@e-commerce/client-web/cart/feature/payment-status').then(
        (r) => r.paymentStatusRoutes,
      ),
  },
  {
    path: 'account',
    canMatch: [canMatchAuth],
    children: [
      {
        path: 'orders',
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/orders').then(
            (r) => r.ordersRoutes,
          ),
        providers: [OrdersStore],
      },
      {
        path: 'information',
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/information').then(
            (r) => r.informationRoutes,
          ),
      },
      {
        path: '**',
        redirectTo: 'orders',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
