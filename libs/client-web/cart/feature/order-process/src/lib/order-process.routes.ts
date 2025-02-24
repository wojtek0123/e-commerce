import { Route } from '@angular/router';
import { cartItemsGuard } from './guards/cart-items.guard';
import { authGuard } from '@e-commerce/client-web/shared/feature';

export const orderProcessRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard, cartItemsGuard],
    data: { redirectTo: 'order-process' },
    loadComponent: () =>
      import('./order-process.component').then((c) => c.OrderProcessComponent),
  },
];
