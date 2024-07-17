import { Route } from '@angular/router';
import { FeatureBooksComponent } from './feature-books/feature-books.component';
import { BooksService } from '@e-commerce/client-web-app/browse/data-access';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const booksRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: FeatureBooksComponent,
    providers: [BooksService],
  },
];
