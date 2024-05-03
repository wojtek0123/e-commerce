import { Route } from '@angular/router';
import { FeatureBooksComponent } from './feature-books/feature-books.component';
import {
  BooksApiService,
  BooksStore,
} from '@e-commerce/client-web-app/browse/data-access';

export const booksRoutes: Route[] = [
  {
    path: '',
    component: FeatureBooksComponent,
    providers: [BooksApiService, BooksStore],
  },
];
