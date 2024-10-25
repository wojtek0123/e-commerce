import { Route } from '@angular/router';
import { InformationComponent } from './information.component';
import { InformationStore } from '@e-commerce/client-web/account/data-access';
import { AuthService } from '@e-commerce/client-web/auth/api';

export const informationRoutes: Route[] = [
  {
    path: '',
    component: InformationComponent,
    providers: [InformationStore, AuthService],
  },
];
