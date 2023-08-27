import { Route } from '@angular/router';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';

export const browseFeatureRoutes: Route[] = [
  { path: 'add', component: AddProductFormComponent },
];
