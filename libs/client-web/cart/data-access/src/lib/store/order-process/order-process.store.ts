import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  OrderDetailsApiService,
  ResponseError,
  ShippingMethod,
  OrderDetails,
  CreateOrderAddress,
  PaymentMethod,
} from '@e-commerce/client-web/shared/data-access';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { async, pipe, switchMap, tap } from 'rxjs';

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
      router = inject(Router)
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

                    await router.navigate(['/payment-status', orderDetails.id]);
                  },
                  error: (error: ResponseError) => {
                    patchState(store, {
                      loading: false,
                      error:
                        error?.error?.message ||
                        'Error occur while checking out',
                    });
                  },
                })
              )
          )
        )
      ),
    })
  )
);
