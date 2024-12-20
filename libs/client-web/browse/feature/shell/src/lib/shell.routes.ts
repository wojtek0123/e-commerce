import { Route } from '@angular/router';
import { APP_ROUTES_FEATURE } from '@e-commerce/client-web/shared/app-config';

export const browseShellRoutes: Route[] = [
  {
    path: APP_ROUTES_FEATURE.BROWSE.BOOKS,
    loadChildren: () =>
      import('@e-commerce/client-web/browse/feature/books').then(
        (r) => r.booksRoutes,
      ),
  },
  {
    path: APP_ROUTES_FEATURE.BROWSE.BOOK,
    loadChildren: () =>
      import('@e-commerce/client-web/browse/feature/book').then(
        (r) => r.bookRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: APP_ROUTES_FEATURE.BROWSE.BOOKS,
  },
];
