import { inject } from '@angular/core';
import { BrowseDataAccessService } from '../services/browse-data-access.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { productsActions } from './products.actions';
import { catchError, concatMap, map, of } from 'rxjs';

export const getProducts$ = createEffect(
  (
    actions$ = inject(Actions),
    productsService = inject(BrowseDataAccessService)
  ) => {
    return actions$.pipe(
      ofType(productsActions.getProducts),
      concatMap(() =>
        productsService.getProducts$().pipe(
          map((products) => productsActions.getProductsSuccess({ products })),
          catchError((error) =>
            of(productsActions.getProductsFailure({ error }))
          )
        )
      )
    );
  },
  { functional: true }
);
