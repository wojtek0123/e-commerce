import { Route } from '@angular/router';
import { AddressInformationComponent } from './address-information/address-information.component';
import { stepGuard } from '@e-commerce/client-web-app/order/data-access';

export const addressInformationRoutes: Route[] = [
  {
    path: '',
    component: AddressInformationComponent,
  },
];
