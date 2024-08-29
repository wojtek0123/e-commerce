import { Route } from '@angular/router';

export const bookRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./book.component').then((c) => c.BookComponent),
  },
];
