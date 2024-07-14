import { Route } from '@angular/router';
import { OrderDetailsApiService } from '@e-commerce/client-web-app/user/data-access';

export const ordersRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./orders/orders.component').then((c) => c.OrdersComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./order/order.component').then((c) => c.OrderComponent),
      },
    ],
    providers: [OrderDetailsApiService],
  },
];
