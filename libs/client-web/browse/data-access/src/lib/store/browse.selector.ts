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

export const selectSelectedPrices = createSelector(
  selectPriceFilter,
  (priceFilter) => Object.values(priceFilter).filter((v) => v),
);
export const selectSelectedAuthors = createSelector(
  selectAuthorFilter,
  (filter) => filter.selectedItems,
);
export const selectSelectedCategories = createSelector(
  selectCategoryFilter,
  (filter) => filter.selectedItems,
);
export const selectSelectedTags = createSelector(
  selectTagFilter,
  (filter) => filter.selectedItems,
);

export const selectAuthors = createSelector(
  selectAuthorFilter,
  (filter) => filter.items,
);
