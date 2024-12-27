import { Route } from '@angular/router';
import { FavouriteBooksListService } from '@e-commerce/client-web/account/api';
import { BooksStore } from '@e-commerce/client-web/browse/data-access';
import { CustomFilterDirective } from '@e-commerce/client-web/browse/utils';
import { CartService } from '@e-commerce/client-web/cart/api';
import { FavouriteBooksListApiService } from '@e-commerce/client-web/shared/data-access/api-services';

export const booksRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./books.component').then((c) => c.BooksComponent),
    providers: [
      CustomFilterDirective,
      BooksStore,
      CartService,
      FavouriteBooksListService,
    ],
  },
];
