import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { authGuard } from '@e-commerce/client-web-app/shared/utils/guards';
import { CountryApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    providers: [CountryApiService],
  },
  {
    path: 'payment-status',
    loadComponent: () =>
      import('@e-commerce/client-web-app/order/ui/payment-status').then(
        (c) => c.PaymentStatusComponent
      ),
  },
];
