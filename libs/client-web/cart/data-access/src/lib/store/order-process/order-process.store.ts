import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import {
  ResponseError,
  ShippingMethod,
  OrderDetails,
  PaymentMethod,
} from '@e-commerce/shared/api-models';
import {
  OrderDetailsApiService,
  CreateOrderAddress,
} from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { pipe, switchMap, tap } from 'rxjs';
import { MessageBusService } from '@e-commerce/client-web/shared/data-access/services';

interface OrderProcessState {
  loading: boolean;
  orderDetails: OrderDetails | null;
}

const initialOrderProcessState: OrderProcessState = {
  orderDetails: null,
  loading: false,
};

export const OrderProcessStore = signalStore(
  withState(initialOrderProcessState),
  withProps(() => ({
    orderDetailsApi: inject(OrderDetailsApiService),
    router: inject(Router),
    appRoutePaths: inject(APP_ROUTE_PATHS_TOKEN),
    messageService: inject(MessageService),
    messageBusService: inject(MessageBusService),
  })),
  withMethods((store) => ({
    checkout: rxMethod<{
      orderAddress: CreateOrderAddress;
      shippingMethodId: ShippingMethod['id'];
      paymentMethod: PaymentMethod;
    }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ orderAddress, shippingMethodId, paymentMethod }) =>
          store.orderDetailsApi
            .create({
              orderAddress,
              shippingMethodId,
              paymentMethod,
            })
            .pipe(
              tapResponse({
                next: async (orderDetails) => {
                  patchState(store, { orderDetails, loading: false });

                  store.messageBusService.setEvent('checkout-success');

                  await store.router.navigate([
                    store.appRoutePaths.PAYMENT_STATUS(orderDetails.id),
                  ]);
                },
                error: (error: ResponseError) => {
                  store.messageService.add({
                    summary: 'Error',
                    detail:
                      error?.error?.message ??
                      'Error occurred while checking out',
                    severity: 'error',
                  });

                  patchState(store, {
                    loading: false,
                  });
                },
              }),
            ),
        ),
      ),
    ),
  })),
);
