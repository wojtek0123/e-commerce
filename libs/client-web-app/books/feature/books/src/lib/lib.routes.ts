import { Route } from '@angular/router';
import { ClientWebAppBooksFeatureBooksComponent } from './client-web-app-books-feature-books/client-web-app-books-feature-books.component';
import {
  BooksApiService,
  BooksService,
  BooksStore,
} from '@e-commerce/client-web-app/books/data-access';

export const clientWebAppBooksFeatureBooksRoutes: Route[] = [
  {
    path: '',
    component: ClientWebAppBooksFeatureBooksComponent,
    providers: [BooksService, BooksApiService, BooksStore],
  },
];
