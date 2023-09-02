import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../models/product.model';

export const productsActions = createActionGroup({
  source: 'Products',
  events: {
    getProducts: emptyProps(),
    getProductsSuccess: props<{ products: Product[] }>(),
    getProductsFailure: props<{ error: Error }>(),
  },
});
