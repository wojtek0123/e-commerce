import { Route } from '@angular/router';
import { BookComponent } from './book/book.component';
import { BooksApiService } from '@e-commerce/client-web-app/browse/data-access';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const bookRoutes: Route[] = [
  {
    path: appRouterConfig.defaultPath,
    component: BookComponent,
    providers: [BooksApiService],
  },
];
