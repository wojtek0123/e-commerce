import { inject, Injectable } from '@angular/core';
import {
  OrderDetailsApiService,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ordersActions } from './orders.actions';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';

@Injectable()
export class OrdersEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly orderDetailsApi = inject(OrderDetailsApiService);

  getOrders = createEffect(() =>
    this.actions$.pipe(
      ofType(ordersActions.getOrders),
      switchMap(() =>
        this.orderDetailsApi.getMany().pipe(
          mapResponse({
            next: (orders) => {
              return ordersActions.getOrdersSuccess({ orders });
            },
            error: (error: ResponseError) => {
              return ordersActions.getOrdersFailure({ error });
            },
          }),
        ),
      ),
    ),
  );
}
