import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { categoryActions } from './category.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { CategoryApiService } from '../services/category-api.service';

export const getCategories$ = createEffect(
  (actions$ = inject(Actions), categoryApi = inject(CategoryApiService)) => {
    return actions$.pipe(
      ofType(categoryActions.getCategories),
      switchMap(() =>
        categoryApi.getCategories$().pipe(
          map((categories) =>
            categoryActions.getCategoriesSuccess({ categories })
          ),
          catchError((responseError) =>
            of(categoryActions.getCategoriesFailure({ responseError }))
          )
        )
      )
    );
  },
  { functional: true }
);
