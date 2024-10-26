import { Route } from '@angular/router';
import { canMatchAuth } from './guards/auth.guard';
import { cartItemsGuard } from './guards/cart-items.guard';
import { paymentStatusGuard } from './guards/payment-status.guard';

export const appRoutes: Route[] = [
  {
    path: 'home',
    loadChildren: () =>
      import('@e-commerce/client-web/home/feature').then((r) => r.homeRoutes),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@e-commerce/client-web/auth/feature/shell').then(
        (r) => r.authShellRoutes
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
    path: 'account',
    loadChildren: () =>
      import('@e-commerce/client-web/account/feature/shell').then(
        (r) => r.accountShellRoutes
      ),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
