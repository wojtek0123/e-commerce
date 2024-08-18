import { createSelector } from '@ngrx/store';
import { browseFeature } from './browse.reducer';

export const {
  selectBooks,
  selectPage,
  selectCount,
  selectError,
  selectTotal,
  selectLoading,
  selectSearch,
  selectSize,
  selectPendingBookIds,
  selectFilters,
  selectActiveFilters,
} = browseFeature;

export const selectAuthorFilter = createSelector(
  selectFilters,
  (filters) => filters.author,
);
export const selectCategoryFilter = createSelector(
  selectFilters,
  (filters) => filters.category,
);
export const selectTagFilter = createSelector(
  selectFilters,
  (filters) => filters.tag,
);
export const selectPriceFilter = createSelector(
  selectFilters,
  (filters) => filters.price,
);
export const selectPriceFilterSelected = createSelector(
  selectPriceFilter,
  (priceFilter) => Object.values(priceFilter).filter((v) => v),
);
