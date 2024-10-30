import { Route } from '@angular/router';
import { OrdersStore } from '@e-commerce/client-web/account/data-access';

export const ordersRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./orders.component').then((c) => c.OrdersComponent),
    providers: [OrdersStore],
  },
];
