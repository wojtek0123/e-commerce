import { Route } from '@angular/router';
import { BookComponent } from './book/book.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

export const bookRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: BookComponent,
  },
];
