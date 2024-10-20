import { Route } from '@angular/router';
import { BookStore } from '@e-commerce/client-web/browse/data-access';

export const bookRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./book.component').then((c) => c.BookComponent),
    providers: [BookStore],
  },
];
