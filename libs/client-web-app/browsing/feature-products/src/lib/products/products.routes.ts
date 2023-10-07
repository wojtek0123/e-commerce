import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import {
  productsEffects,
  productsFeature,
} from '@e-commerce/client-web-app/browsing/data-access';
import { provideEffects } from '@ngrx/effects';

import { ProductsComponent } from './products.component';

export const productsRoutes: Route[] = [
  {
    path: '',
    component: ProductsComponent,
    providers: [provideState(productsFeature), provideEffects(productsEffects)],
  },
];
