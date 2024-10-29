import { Route } from '@angular/router';
import { AddressStore } from '@e-commerce/client-web/account/data-access';

export const addressesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./addresses.component').then((c) => c.AddressesComponent),
    providers: [AddressStore],
  },
];
