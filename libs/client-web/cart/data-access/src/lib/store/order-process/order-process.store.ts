import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import {
  ResponseError,
  ShippingMethod,
  OrderDetails,
  PaymentMethod,
} from '@e-commerce/client-web/shared/data-access/api-models';
import {
  OrderDetailsApiService,
  CreateOrderAddress,
} from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface OrderProcessState {
  loading: boolean;
  error: string | null;
  orderDetails: OrderDetails | null;
}

const initialOrderProcessState: OrderProcessState = {
  orderDetails: null,
  loading: false,
  error: null,
};

export const OrderProcessStore = signalStore(
  withState(initialOrderProcessState),
  withMethods(
    (
      store,
      orderDetailsApi = inject(OrderDetailsApiService),
      router = inject(Router),
      appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN),
    ) => ({
      checkout: rxMethod<{
        orderAddress: CreateOrderAddress;
        shippingMethodId: ShippingMethod['id'];
        paymentMethod: PaymentMethod;
      }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ orderAddress, shippingMethodId, paymentMethod }) =>
            orderDetailsApi
              .create({
                orderAddress,
                shippingMethodId,
                paymentMethod,
              })
              .pipe(
                tapResponse({
                  next: async (orderDetails) => {
                    patchState(store, { orderDetails, loading: false });

                    await router.navigate([
                      appRoutePaths.PAYMENT_STATUS(orderDetails.id),
                    ]);
                  },
                  error: (error: ResponseError) => {
                    patchState(store, {
                      loading: false,
                      error:
                        error?.error?.message ||
                        'An error occur while checking out',
                    });
                  },
                }),
              ),
          ),
        ),
      ),
    }),
  ),
);
