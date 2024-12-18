import { Route } from '@angular/router';
import { BooksStore } from '@e-commerce/client-web/browse/data-access';
import { CustomFilterDirective } from '@e-commerce/client-web/browse/utils';
import { CartService } from '@e-commerce/client-web/cart/api';

export const booksRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./books.component').then((c) => c.BooksComponent),
    providers: [CustomFilterDirective, BooksStore, CartService],
  },
];
