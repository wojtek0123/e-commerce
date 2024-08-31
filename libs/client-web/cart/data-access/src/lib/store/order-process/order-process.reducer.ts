import { createFeature, createReducer, on } from '@ngrx/store';
import {
  initialOrderProcessState,
  OrderProcessState,
} from './order-process.state';
import { orderProcessActions } from './order-process.actions';

export const orderProcessFeature = createFeature({
  name: 'orderProccess',
  reducer: createReducer(
    initialOrderProcessState,
    on(
      orderProcessActions.getUserAddress,
      orderProcessActions.addUserAddress,
      (state): OrderProcessState => ({
        ...state,
        address: {
          ...state.address,
          loading: true,
        },
      }),
    ),
    on(
      orderProcessActions.getUserAddressSuccess,
      orderProcessActions.addUserAddressSucess,
      (state, { userAddress }): OrderProcessState => ({
        ...state,
        address: {
          ...state.address,
          data: userAddress,
          loading: false,
        },
      }),
    ),
    on(
      orderProcessActions.updateUserAddress,
      (state, { data }): OrderProcessState => {
        if (!state.address.data) {
          return {
            ...state,
          };
        }

        return {
          ...state,
          address: {
            ...state.address,
            cache: state.address.data,
            data: {
              id: state.address.data.id,
              ...data,
            },
          },
        };
      },
    ),
    on(orderProcessActions.updateUserAddressSucess, (state) => ({
      ...state,
      userAddress: {
        ...state.address,
        cache: null,
      },
    })),
    on(orderProcessActions.updateUserAddressFailure, (state) => ({
      ...state,
      userAddress: {
        ...state.address,
        data: state.address.cache,
        cache: null,
      },
    })),
    on(
      orderProcessActions.getUserAddressFailure,
      orderProcessActions.addUserAddressFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        address: {
          ...state.address,
          error: error.message,
          loading: false,
        },
      }),
    ),
    on(
      orderProcessActions.getShippingMethods,
      (state): OrderProcessState => ({
        ...state,
        shipping: {
          ...state.shipping,
          loading: true,
        },
      }),
    ),
    on(
      orderProcessActions.getShippingMethodsSuccess,
      (state, { shippingMethods }): OrderProcessState => ({
        ...state,
        shipping: {
          ...state.shipping,
          loading: false,
          data: shippingMethods,
          selectedShippingMethod: shippingMethods.at(0) ?? null,
        },
      }),
    ),
    on(
      orderProcessActions.getShippingMethodsFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        shipping: {
          ...state.shipping,
          loading: false,
          error: error.message,
        },
      }),
    ),
    on(
      orderProcessActions.getCreditCard,
      orderProcessActions.addCreditCard,
      (state): OrderProcessState => ({
        ...state,
        payment: {
          ...state.payment,
          creditCard: {
            ...state.payment.creditCard,
            loading: true,
          },
        },
      }),
    ),
    on(
      orderProcessActions.getCreditCardSuccess,
      orderProcessActions.addCreditCardSucess,
      (state, { creditCard }): OrderProcessState => ({
        ...state,
        payment: {
          ...state.payment,
          creditCard: {
            ...state.payment.creditCard,
            data: creditCard,
            loading: false,
          },
          selectedPaymentMethod: 'credit-card',
        },
      }),
    ),
    on(
      orderProcessActions.getCreditCardFailure,
      orderProcessActions.addCreditCardFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        payment: {
          ...state.payment,
          creditCard: {
            ...state.payment.creditCard,
            loading: false,
            error: error.message,
          },
        },
      }),
    ),
    on(
      orderProcessActions.getCountries,
      (state): OrderProcessState => ({
        ...state,
        address: {
          ...state.address,
          countries: {
            ...state.address.countries,
            loading: true,
          },
        },
      }),
    ),
    on(
      orderProcessActions.getCountriesSuccess,
      (state, { countries }): OrderProcessState => ({
        ...state,
        address: {
          ...state.address,
          countries: {
            ...state.address.countries,
            data: countries,
            loading: false,
          },
        },
      }),
    ),
    on(
      orderProcessActions.getCountriesFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        address: {
          ...state.address,
          countries: {
            ...state.address.countries,
            error: error.message,
            loading: false,
          },
        },
      }),
    ),
    on(
      orderProcessActions.selectPaymentMethod,
      (state, { paymentMethod }): OrderProcessState => ({
        ...state,
        payment: {
          ...state.payment,
          selectedPaymentMethod: paymentMethod,
        },
      }),
    ),
    on(
      orderProcessActions.selectShippingMethod,
      (state, { shippingMethod }): OrderProcessState => ({
        ...state,
        shipping: {
          ...state.shipping,
          selectedShippingMethod: shippingMethod,
        },
      }),
    ),
    on(
      orderProcessActions.setSixDigitCode,
      (state, { code }): OrderProcessState => ({
        ...state,
        payment: {
          ...state.payment,
          sixDigitCode: code,
        },
      }),
    ),
    on(
      orderProcessActions.checkout,
      (state): OrderProcessState => ({
        ...state,
        checkout: {
          ...state.checkout,
          loading: true,
        },
      }),
    ),
    on(
      orderProcessActions.checkoutFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        checkout: {
          ...state.checkout,
          loading: false,
          error: error.message,
        },
      }),
    ),
    on(
      orderProcessActions.checkoutSuccess,
      (): OrderProcessState => ({
        ...initialOrderProcessState,
      }),
    ),
  ),
});
