import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';

export const homeRoutes: Route[] = [
  {
    path: appRouterConfig.emptyPath,
    component: HomeComponent,
    providers: [BooksApiService],
  },
];
