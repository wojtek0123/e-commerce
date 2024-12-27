import { Route } from '@angular/router';
import { FavouriteBooksListStore } from '@e-commerce/client-web/account/data-access';
import { FavouriteBooksListApiService } from '@e-commerce/client-web/shared/data-access/api-services';

export const favouriteBooksListRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../lib/favourite-books-list.component').then(
        (c) => c.FavouriteBooksListComponent,
      ),
    providers: [FavouriteBooksListStore, FavouriteBooksListApiService],
  },
];
