import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';

import { ProductsService } from '../services/products.service';
import { productsActions } from './products.actions';

export const getProducts$ = createEffect(
  (actions$ = inject(Actions), productsService = inject(ProductsService)) => {
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
