import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { authGuard } from '@e-commerce/client-web-app/shared/utils/guards';
import { userAddressResolver } from './resolvers/get-user-address.resolver';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'address-information',
        resolve: { userAddress: userAddressResolver },
        loadComponent: () =>
          import('@e-commerce/client-web-app/order/ui/order-details').then(
            (c) => c.OrderDetailsComponent
          ),
      },
    ],
  },
];
