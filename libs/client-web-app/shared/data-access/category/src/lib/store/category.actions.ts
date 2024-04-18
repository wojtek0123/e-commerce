import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ResponseError, Category } from '@e-commerce/client-web-app/shared/data-access/api-types'

export const categoryActions = createActionGroup({
  source: 'category',
  events: {
    getCategories: emptyProps(),
    getCategoriesSuccess: props<{ categories: Category[] }>(),
    getCategoriesFailure: props<{ responseError: ResponseError }>()
  }
})
