import { Route } from '@angular/router';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { CartService } from '@e-commerce/client-web/cart/api';

export const bookRoutes: Route[] = [
  {
    path: ':bookId',
    loadComponent: () =>
      import('./book.component').then((c) => c.BookComponent),
    providers: [BookStore, CartService],
  },
];
