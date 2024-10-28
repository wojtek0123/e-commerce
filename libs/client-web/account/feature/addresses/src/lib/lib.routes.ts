import { Route } from '@angular/router';
import { AddressesComponent } from './addresses.component';
import { AddressStore } from '@e-commerce/client-web/account/data-access';

export const addressesRoutes: Route[] = [
  { path: '', component: AddressesComponent, providers: [AddressStore] },
];
