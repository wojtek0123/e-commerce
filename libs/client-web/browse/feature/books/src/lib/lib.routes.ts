import { Route } from '@angular/router';

export const booksRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./books/books.component').then((c) => c.BooksComponent),
  },
];
