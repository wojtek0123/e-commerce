import { Route } from '@angular/router';
import { BookComponent } from './book/book.component';
import {
  BooksApiService,
  ProductInventoryApiService,
} from '@e-commerce/client-web-app/shared/data-access/api-services';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const bookRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: BookComponent,
    providers: [BooksApiService, ProductInventoryApiService],
  },
];
