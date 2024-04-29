import { categoryFeature } from './category.reducer';

const { selectCategories, selectStatus } = categoryFeature;

export const categorySelectors = {
  selectCategories,
  selectStatus,
};
