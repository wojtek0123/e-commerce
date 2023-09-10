import { Route } from '@angular/router';
import { ProductsComponent } from './products.component';
import { provideState } from '@ngrx/store';
import {
  productsEffects,
  productsFeature,
} from '@e-commerce/client-web-app/browsing/data-access';
import { provideEffects } from '@ngrx/effects';

export const productsRoutes: Route[] = [
  {
    path: '',
    component: ProductsComponent,
    providers: [provideState(productsFeature), provideEffects(productsEffects)],
  },
];
