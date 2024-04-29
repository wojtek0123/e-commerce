import { createFeature, createReducer, on } from '@ngrx/store';
import { CategoryState, initialCategoryState } from './category.state';
import { categoryActions } from './category.actions';

export const categoryFeature = createFeature({
  name: 'category',
  reducer: createReducer(
    initialCategoryState,
    on(
      categoryActions.getCategories,
      (state): CategoryState => ({
        ...state,
        status: 'loading',
      })
    ),
    on(
      categoryActions.getCategoriesSuccess,
      (state, { categories }): CategoryState => {
        console.log(categories);
        return {
          ...state,
          categories,
          status: 'ok',
        };
      }
    ),
    on(
      categoryActions.getCategoriesFailure,
      (state, { responseError }): CategoryState => ({
        ...state,
        status: { error: responseError.error.message },
      })
    )
  ),
});
