import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { OrdersStore } from '@e-commerce/client-web/account/data-access';
import { canMatchAuth } from './guards/auth.guard';
import { cartItemsGuard } from './guards/cart-items.guard';
import { paymentStatusGuard } from './guards/payment-status.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@e-commerce/client-web/home/feature').then((r) => r.homeRoutes),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('@e-commerce/client-web/auth/feature/login').then(
        (r) => r.loginRoutes
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('@e-commerce/client-web/auth/feature/register').then(
        (r) => r.registerRoutes
      ),
  },
  {
    path: 'browse',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('@e-commerce/client-web/browse/feature/books').then(
            (r) => r.booksRoutes
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
            (r) => r.bookRoutes
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
        (r) => r.orderProcessRoutes
      ),
  },
  {
    path: 'payment-status/:order-details-id',
    // TODO: canMatch guard to check if user ordered and pay
    canMatch: [paymentStatusGuard],
    loadChildren: () =>
      import('@e-commerce/client-web/cart/feature/payment-status').then(
        (r) => r.paymentStatusRoutes
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
            (r) => r.ordersRoutes
          ),
        providers: [OrdersStore],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/settings').then(
            (r) => r.settingsRoutes
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
