import { inject } from '@angular/core';
import {
  CreditCardApiService,
  CreditCardBase,
  ResponseError,
  PaymentMethod,
} from '@e-commerce/client-web/shared/data-access';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface PaymentState {
  creditCard: {
    data: CreditCardBase | null;
    loading: boolean;
    error: string | null;
    isEditing: boolean;
  };
  sixDigitCode: string | null;
  selectedPayment: PaymentMethod | null;
}

const initialPaymentState: PaymentState = {
  creditCard: {
    data: null,
    loading: false,
    error: null,
    isEditing: false,
  },
  sixDigitCode: null,
  selectedPayment: 'CREDIT_CARD',
};

export const PaymentStore = signalStore(
  withState(initialPaymentState),
  withMethods((store, creditCardApi = inject(CreditCardApiService)) => ({
    getCreditCard: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, (state) => ({
            creditCard: { ...state.creditCard, loading: true },
          })),
        ),
        switchMap(() =>
          creditCardApi.get$().pipe(
            tapResponse({
              next: (creditCard) => {
                patchState(store, (state) => ({
                  ...state,
                  creditCard: {
                    ...state.creditCard,
                    data: creditCard,
                    loading: false,
                  },
                }));
              },
              error: (error: ResponseError) => {
                patchState(store, (state) => ({
                  creditCard: {
                    ...state.creditCard,
                    error:
                      error?.error?.message ||
                      'Error occur while getting credit card information',
                    loading: false,
                  },
                }));
              },
            }),
          ),
        ),
      ),
    ),
    selectPaymentMethod: (paymentMethod: PaymentMethod) => {
      patchState(store, { selectedPayment: paymentMethod });
    },
    enterSixDigitCode: (code: string | null) => {
      patchState(store, { sixDigitCode: code });
    },
  })),
);
