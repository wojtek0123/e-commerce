import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { authGuard } from '@e-commerce/client-web-app/shared/utils/guards';
import { userAddressResolver } from './resolvers/get-user-address.resolver';
import { CountryApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'address-information',
        resolve: { userAddress: userAddressResolver },
        providers: [CountryApiService],
        loadComponent: () =>
          import('@e-commerce/client-web-app/order/ui/order-details').then(
            (c) => c.OrderDetailsComponent
          ),
      },
      {
        path: 'shipping',
        loadComponent: () =>
          import('@e-commerce/clien-web-app/order/ui/order-shipping').then(
            (c) => c.OrderShippingComponent
          ),
      },
    ],
  },
];
