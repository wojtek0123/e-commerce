import { createFeature, createReducer, on } from '@ngrx/store';
import { productsActions } from './products.actions';

import { Product } from '@e-commerce/client-web-app/shared/data-access/api-types';

export interface ProductsState {
  products: Product[];
  status: 'idle' | 'loading' | 'error' | 'loaded';
  error: string | null;
}

export const initialState: ProductsState = {
  products: [],
  status: 'idle',
  error: null,
};

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(
      productsActions.getProducts,
      (state): ProductsState => ({ ...state, status: 'loading' })
    ),
    on(
      productsActions.getProductsSuccess,
      (state, { products }): ProductsState => ({
        ...state,
        products,
        status: 'loaded',
      })
    ),
    on(
      productsActions.getProductsFailure,
      (state, error): ProductsState => ({
        ...state,
        status: 'error',
        error: error.error.message,
      })
    )
  ),
});
