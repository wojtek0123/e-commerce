import { Route } from '@angular/router';
import {
  AddressStore,
  InformationStore,
} from '@e-commerce/client-web/account/data-access';

export const informationRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./information.component').then((c) => c.InformationComponent),
    providers: [InformationStore, AddressStore],
  },
];
