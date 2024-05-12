import { Route } from '@angular/router';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const shellRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    children: [
      {
        path: appRouterConfig.emptyPath,
        loadChildren: () =>
          import('@e-commerce/client-web-app/browse/feature/books').then(
            (r) => r.booksRoutes
          ),
      },
      {
        path: `:${appRouterConfig.browse.bookId}`,
        loadChildren: () =>
          import('@e-commerce/client-web-app/browse/feature/book').then(
            (r) => r.bookRoutes
          ),
      },
    ],
  },
];
