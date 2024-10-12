import { inject } from '@angular/core';
import {
  ResponseError,
  ShippingMethodApiService,
} from '@e-commerce/client-web/shared/data-access';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ShippingMethod } from '@prisma/client';
import { pipe, switchMap, tap } from 'rxjs';

interface ShippingState {
  shippings: ShippingMethod[];
  selectedShipping: ShippingMethod | null;
  loading: boolean;
  error: string | null;
}

const initialShippingState: ShippingState = {
  shippings: [],
  selectedShipping: null,
  loading: false,
  error: null,
};

export const ShippingStore = signalStore(
  withState(initialShippingState),
  withMethods(
    (store, shippingMethodApi = inject(ShippingMethodApiService)) => ({
      getShippings: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            shippingMethodApi.getAll$().pipe(
              tapResponse({
                next: (shippings) => {
                  patchState(store, { shippings, loading: false });
                },
                error: (error: ResponseError) => {
                  patchState(store, {
                    error:
                      error?.error?.message ||
                      'Error occur while getting shippings',
                    loading: false,
                  });
                },
              }),
            ),
          ),
        ),
      ),
      selectShipping: (selectedShipping: ShippingMethod) => {
        patchState(store, { selectedShipping });
      },
    }),
  ),
  withHooks({
    onInit: (store) => {
      store.getShippings();
    },
  }),
);
