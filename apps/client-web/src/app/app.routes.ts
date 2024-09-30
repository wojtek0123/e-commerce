import { Route } from '@angular/router';
import {
  BookEffects,
  bookFeature,
  BooksStore,
} from '@e-commerce/client-web/browse/data-access';
import {
  OrderProcessEffects,
  orderProcessFeature,
} from '@e-commerce/client-web/cart/data-access';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { OrdersStore } from '@e-commerce/client-web/account/data-access';
import { canMatchAuth } from './guards/auth.guard';

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
        (r) => r.loginRoutes,
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('@e-commerce/client-web/auth/feature/register').then(
        (r) => r.registerRoutes,
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
            (r) => r.booksRoutes,
          ),
      },
    ],
    providers: [BooksStore],
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
    providers: [provideState(bookFeature), provideEffects(BookEffects)],
  },
  {
    path: 'order-process',
    // canMatch: [canMatchAuth],
    loadChildren: () =>
      import('@e-commerce/client-web/cart/feature/order-process').then(
        (r) => r.orderProcessRoutes,
      ),
    providers: [
      provideState(orderProcessFeature),
      provideEffects(OrderProcessEffects),
    ],
  },
  {
    path: 'payment-status/:order-details-id',
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
        path: 'settings',
        loadChildren: () =>
          import('@e-commerce/client-web/account/feature/settings').then(
            (r) => r.settingsRoutes,
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
