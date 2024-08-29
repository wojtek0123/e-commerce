import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { categoryActions } from './category.action';
import { CategoryApiService } from '../../api-services';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { ResponseError } from '../../api-models';
@Injectable()
export class CategoryEffect {
  private actions$ = inject(Actions);
  private categoryApi = inject(CategoryApiService);

  getCategories = createEffect(() =>
    this.actions$.pipe(
      ofType(categoryActions.getCategories),
      switchMap(() =>
        this.categoryApi.getCategories$({}).pipe(
          mapResponse({
            next: (categories) =>
              categoryActions.getCategoriesSuccess({ categories }),
            error: (error: ResponseError) => {
              return categoryActions.getCategoriesFailure({ error });
            },
          }),
        ),
      ),
    ),
  );
}
