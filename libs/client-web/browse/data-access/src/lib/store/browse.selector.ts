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
} = browseFeature;

export const selectAuthorFilter = createSelector(
  selectFilters,
  (filters) => filters.author,
);
export const selectCategoryFilter = createSelector(
  selectFilters,
  (filters) => filters.category,
);
export const selectTagsFilter = createSelector(
  selectFilters,
  (filters) => filters.tag,
);
