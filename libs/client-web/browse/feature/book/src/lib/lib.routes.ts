import { Route } from '@angular/router';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { CartService } from '@e-commerce/client-web/cart/api';
import { APP_ROUTES_PARAMS } from '@e-commerce/client-web/shared/app-config';

export const bookRoutes: Route[] = [
  {
    path: `:${APP_ROUTES_PARAMS.BROWSE_BOOK_ID}`,
    loadComponent: () =>
      import('./book.component').then((c) => c.BookComponent),
    providers: [BookStore, CartService],
  },
];
