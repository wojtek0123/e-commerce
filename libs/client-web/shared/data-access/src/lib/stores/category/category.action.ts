import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Category, ResponseError } from '../../api-models';

export const categoryActions = createActionGroup({
  source: 'category',
  events: {
    getCategories: emptyProps(),
    getCategoriesSuccess: props<{ categories: Category[] }>(),
    getCategoriesFailure: props<{ error: ResponseError }>(),
  },
});
