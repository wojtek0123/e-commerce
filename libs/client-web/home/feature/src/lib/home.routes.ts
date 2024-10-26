import { Route } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeStore } from '@e-commerce/client-web/home/data-acess';
import { CartService } from '@e-commerce/client-web/cart/api';

export const homeRoutes: Route[] = [
  { path: '', component: HomeComponent, providers: [HomeStore, CartService] },
];
