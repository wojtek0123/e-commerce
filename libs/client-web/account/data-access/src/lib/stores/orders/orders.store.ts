import { inject } from '@angular/core';
import {
  OrderDetails,
  OrderDetailsBase,
  ResponseError,
} from '@e-commerce/shared/api-models';
import { OrderDetailsApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

interface OrdersState {
  loading: boolean;
  error: string | null;
  orders: OrderDetailsBase[];
  selectedOrder: {
    data: OrderDetails | null;
    loading: boolean;
    error: string | null;
  };
}

const initialOrdersState: OrdersState = {
  loading: false,
  error: null,
  orders: [],
  selectedOrder: {
    data: null,
    loading: false,
    error: null,
  },
};

export const OrdersStore = signalStore(
  withState(initialOrdersState),
  withMethods((store, ordersApi = inject(OrderDetailsApiService)) => ({
    getOrders: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, { loading: true, orders: [], error: null }),
        ),
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
                    error?.error?.message ||
                    'Error occurred while getting orders',
                });
              },
            }),
          ),
        ),
      ),
    ),
    getOrderDetails: rxMethod<{ id: OrderDetailsBase['id'] }>(
      pipe(
        tap(() =>
          patchState(store, {
            selectedOrder: { data: null, loading: true, error: null },
          }),
        ),
        filter(({ id }) => !!id),
        switchMap(({ id }) =>
          ordersApi.getUnique(id).pipe(
            tapResponse({
              next: (orderDetails) => {
                patchState(store, (state) => ({
                  selectedOrder: {
                    ...state.selectedOrder,
                    data: orderDetails,
                    loading: false,
                  },
                }));
              },
              error: (error: ResponseError) => {
                patchState(store, (state) => ({
                  selectedOrder: {
                    ...state.selectedOrder,
                    loading: false,
                    error:
                      error?.error?.message ??
                      'Error occured while getting order details',
                  },
                }));
              },
            }),
          ),
        ),
      ),
    ),
    unselectOrder: () => {
      patchState(store, {
        selectedOrder: { data: null, loading: false, error: null },
      });
    },
  })),
  withHooks({
    onInit(store) {
      store.getOrders();
    },
  }),
);
