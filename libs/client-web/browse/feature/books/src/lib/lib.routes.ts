import { Route } from '@angular/router';
import { CustomFilterDirective } from '@e-commerce/client-web/browse/utils';

export const booksRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./books.component').then((c) => c.BooksComponent),
    providers: [CustomFilterDirective],
  },
];
