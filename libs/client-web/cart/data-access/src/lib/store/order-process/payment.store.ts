import { inject } from '@angular/core';
import {
  CreditCardApiService,
  CreditCardBase,
  ResponseError,
  PaymentMethod,
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
import { MessageService } from 'primeng/api';
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
  withMethods(
    (
      store,
      creditCardApi = inject(CreditCardApiService),
      messageService = inject(MessageService),
    ) => ({
      getCreditCard$: rxMethod<void>(
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
                        'An error occurred while getting credit card information',
                      loading: false,
                    },
                  }));
                },
              }),
            ),
          ),
        ),
      ),
      addCreditCard$: rxMethod<{
        number: string;
        expirationDate: string;
        securityCode: string;
      }>(
        pipe(
          tap(({ number }) => {
            patchState(store, (state) => ({
              creditCard: { ...state.creditCard, loading: true },
            }));
          }),
          switchMap(({ number, expirationDate, securityCode }) =>
            creditCardApi
              .create$({ number, expirationDate, securityCode })
              .pipe(
                tapResponse({
                  next: (creditCard) => {
                    patchState(store, (state) => ({
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
                        data: null,
                        loading: false,
                        error:
                          error?.error?.message ??
                          'An error occurred while adding credit card',
                      },
                    }));
                    messageService.add({
                      summary: 'Error',
                      detail:
                        error?.error?.message ??
                        'An error occurred while adding credit card',
                      severity: 'error',
                    });
                  },
                }),
              ),
          ),
        ),
      ),
      toggleCreditCardEdit: (isEditing: boolean) => {
        patchState(store, (state) => ({
          creditCard: { ...state.creditCard, isEditing },
        }));
      },
      selectPaymentMethod: (paymentMethod: PaymentMethod) => {
        patchState(store, { selectedPayment: paymentMethod });
      },
      enterSixDigitCode: (code: string | null) => {
        patchState(store, { sixDigitCode: code });
      },
    }),
  ),
  withHooks({
    onInit: (store) => {
      store.getCreditCard$();
    },
  }),
);
