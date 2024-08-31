import { Route } from '@angular/router';
import {
  BookEffects,
  bookFeature,
  BrowseEffect,
  browseFeature,
} from '@e-commerce/client-web/browse/data-access';
import {
  OrderProcessEffects,
  orderProcessFeature,
} from '@e-commerce/client-web/cart/data-access';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const appRoutes: Route[] = [
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
    providers: [provideState(browseFeature), provideEffects(BrowseEffect)],
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
];
