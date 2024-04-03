import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HomeService } from '../services/home.service';
import { homeActions } from './home.actions';
import { catchError, map, of, switchMap } from 'rxjs';

export const getCategories$ = createEffect(
  (actions$ = inject(Actions), homeService = inject(HomeService)) => {
    return actions$.pipe(
      ofType(homeActions.getCategories),
      switchMap(() =>
        homeService.getCategories$().pipe(
          map(({ categories }) =>
            homeActions.getCategoriesSuccess({ categories })
          ),
          catchError((error) => of(homeActions.getCategoriesFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);
