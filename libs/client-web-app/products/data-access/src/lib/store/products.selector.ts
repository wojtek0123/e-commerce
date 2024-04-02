import { createSelector } from '@ngrx/store';
import { productsFeature } from './products.reducer';

export const { selectProductsState } = productsFeature;
export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.products
);
export const selectStatus = createSelector(
  selectProductsState,
  (state) => state.status
);
export const selectErrorMessage = createSelector(
  selectProductsState,
  (state) => state.error
);
