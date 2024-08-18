import { createFeature, createReducer, on, select } from '@ngrx/store';
import { initialCategoryState } from './category.state';
import { categoryActions } from './category.action';

export const categoryFeature = createFeature({
  name: 'category',
  reducer: createReducer(
    initialCategoryState,
    on(categoryActions.getCategories, (state) => ({
      ...state,
      loading: true,
    })),
    on(categoryActions.getCategoriesSuccess, (state, { categories }) => ({
      ...state,
      categories,
      loading: false,
    })),
    on(categoryActions.getCategoriesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: error.message,
    })),
  ),
});
