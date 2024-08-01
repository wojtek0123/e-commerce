import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { authGuard } from '@e-commerce/client-web-app/shared/data-access/guards';
import {
  StepService,
  isCartEmptyGuard,
  stepGuard,
} from '@e-commerce/client-web-app/order/data-access';

export const shellRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'address-information',
        loadChildren: () =>
          import(
            '@e-commerce/client-web-app/order/feature/address-information'
          ).then((r) => r.addressInformationRoutes),
      },
      {
        path: 'shipping-method',
        loadChildren: () =>
          import(
            '@e-commerce/client-web-app/order/feature/shipping-method'
          ).then((r) => r.shippingMethodRoutes),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('@e-commerce/client-web-app/order/feature/payment').then(
            (r) => r.paymentRoutes,
          ),
      },
      {
        path: '**',
        redirectTo: 'address-information',
      },
    ],
    canActivate: [authGuard, isCartEmptyGuard],
    canActivateChild: [stepGuard],
    providers: [StepService],
  },
  {
    path: 'payment-status',
    loadComponent: () =>
      import('@e-commerce/client-web-app/order/ui/payment-status').then(
        (c) => c.PaymentStatusComponent,
      ),
  },
];
