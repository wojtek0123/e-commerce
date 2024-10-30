import { Route } from '@angular/router';
import { HomeStore } from '@e-commerce/client-web/home/data-acess';
import { CartService } from '@e-commerce/client-web/cart/api';

export const homeRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((c) => c.HomeComponent),
    providers: [HomeStore, CartService],
  },
];
