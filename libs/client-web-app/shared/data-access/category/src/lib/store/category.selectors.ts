import { categoryFeature } from './category.reducer';

const { selectCategories, selectStatus, selectErrorMessage } = categoryFeature;

export const categorySelectors = {
  selectCategories,
  selectStatus,
  selectErrorMessage,
};
