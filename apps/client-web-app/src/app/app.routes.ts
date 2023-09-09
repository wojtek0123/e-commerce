import { Route } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ProductsComponent } from '@e-commerce/client-web-app/browsing/feature-products';
import { provideState } from '@ngrx/store';
import {
  productsEffects,
  productsFeature,
} from '@e-commerce/client-web-app/browsing/data-access';
import { provideEffects } from '@ngrx/effects';

export const appRoutes: Route[] = [
  {
    path: '',
    component: NxWelcomeComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
    providers: [provideState(productsFeature), provideEffects(productsEffects)],
  },
  {
    path: 'product/details/:id',
    component: NxWelcomeComponent,
  },
];
