import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '@e-commerce/client-web-app/shared/api-types';

export const productsActions = createActionGroup({
  source: 'Products',
  events: {
    getProducts: emptyProps(),
    getProductsSuccess: props<{ products: Product[] }>(),
    getProductsFailure: props<{ error: Error }>(),
  },
});
