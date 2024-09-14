import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeStore } from '@e-commerce/client-web/home/data-acess';

export const homeRoutes: Route[] = [
  { path: '', component: HomeComponent, providers: [HomeStore] },
];
