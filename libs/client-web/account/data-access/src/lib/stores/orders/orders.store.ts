import { inject } from '@angular/core';
import {
  OrderDetails,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access/api-models';
import { OrderDetailsApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface OrdersState {
  loading: boolean;
  error: string | null;
  orders: OrderDetails[];
}

const initialOrdersState: OrdersState = {
  loading: false,
  error: null,
  orders: [],
};

export const OrdersStore = signalStore(
  withState(initialOrdersState),
  withMethods((store, ordersApi = inject(OrderDetailsApiService)) => ({
    getOrders: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          ordersApi.getMany().pipe(
            tapResponse({
              next: (orders) => {
                patchState(store, { loading: false, orders });
              },
              error: (error: ResponseError) => {
                patchState(store, {
                  loading: false,
                  error:
                    error?.error?.message || 'Error occur while getting orders',
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.getOrders();
    },
  }),
);
