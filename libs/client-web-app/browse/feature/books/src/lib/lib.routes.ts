import { Route } from '@angular/router';
import { FeatureBooksComponent } from './feature-books/feature-books.component';
import {
  BooksApiService,
  BooksStore,
} from '@e-commerce/client-web-app/browse/data-access';
import { categoriesResolver } from './resolvers/categories.resolver';

export const booksRoutes: Route[] = [
  {
    path: '',
    component: FeatureBooksComponent,
    resolve: { categories: categoriesResolver },
    providers: [BooksApiService, BooksStore],
  },
];
