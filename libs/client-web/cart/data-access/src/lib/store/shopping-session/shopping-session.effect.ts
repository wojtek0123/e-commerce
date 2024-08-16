import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { shoppingSessionActions } from './shopping-session.action';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import {
  ResponseError,
  ShoppingSessionApiService,
} from '@e-commerce/client-web/shared/data-access';

@Injectable()
export class ShoppingSessionEffect {
  private actions$ = inject(Actions);
  private shoppingSessionApi = inject(ShoppingSessionApiService);

  getShoppingSession = createEffect(() =>
    this.actions$.pipe(
      ofType(shoppingSessionActions.getShoppingSession),
      switchMap(() =>
        this.shoppingSessionApi.getShoppingSession().pipe(
          mapResponse({
            next: (shoppingSession) => {
              return shoppingSessionActions.getShoppingSessionSuccess({
                shoppingSession,
              });
            },
            error: (error: ResponseError) => {
              return shoppingSessionActions.getShoppingSessionFailure({
                error,
              });
            },
          }),
        ),
      ),
    ),
  );
}
