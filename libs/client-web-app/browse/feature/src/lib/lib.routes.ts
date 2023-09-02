import { Route } from '@angular/router';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';
import { ProductsComponent } from './products/products.component';
import { provideState } from '@ngrx/store';
import { productsFeature } from '@e-commerce/client-web-app/browse/data-access';
import { provideEffects } from '@ngrx/effects';
import { productsEffects } from '@e-commerce/client-web-app/browse/data-access';

export const browseFeatureRoutes: Route[] = [
  {
    path: '',
    component: ProductsComponent,
    providers: [provideState(productsFeature), provideEffects(productsEffects)],
  },
  { path: 'add', component: AddProductFormComponent },
];
