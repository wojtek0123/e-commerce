import { Route } from '@angular/router';
import { FeatureBooksComponent } from './feature-books/feature-books.component';
import {
  BooksApiService,
  BooksStore,
} from '@e-commerce/client-web-app/books/data-access';

export const clientWebAppBooksFeatureBooksRoutes: Route[] = [
  {
    path: '',
    component: FeatureBooksComponent,
    providers: [BooksApiService, BooksStore],
  },
];
