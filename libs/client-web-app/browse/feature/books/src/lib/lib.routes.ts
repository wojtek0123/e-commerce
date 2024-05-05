import { Route } from '@angular/router';
import { FeatureBooksComponent } from './feature-books/feature-books.component';
import {
  BooksApiService,
  BooksStore,
} from '@e-commerce/client-web-app/browse/data-access';
import { categoriesResolver } from './resolvers/categories.resolver';
import { RouterConfig } from '@e-commerce/client-web-app/browse/utils/router-config';

export const booksRoutes: Route[] = [
  {
    path: '',
    component: FeatureBooksComponent,
    resolve: {
      [RouterConfig.categoriesData]: categoriesResolver,
    },
    providers: [BooksApiService, BooksStore],
  },
];
