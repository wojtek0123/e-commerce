import { Route } from '@angular/router';
import { FeatureBooksComponent } from './feature-books/feature-books.component';
import { BooksStore } from '@e-commerce/client-web-app/browse/data-access';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { categoriesResolver } from './resolvers/categories.resolver';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const booksRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: FeatureBooksComponent,
    resolve: {
      [appRouterConfig.browse.categoriesData]: categoriesResolver,
    },
    providers: [BooksApiService, BooksStore],
  },
];
