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
        userAddress: {
          ...state.userAddress,
          loading: true,
        },
      }),
    ),
    on(
      orderProcessActions.getUserAddressSuccess,
      orderProcessActions.addUserAddressSucess,
      (state, { userAddress }): OrderProcessState => ({
        ...state,
        userAddress: {
          ...state.userAddress,
          data: userAddress,
          loading: false,
        },
      }),
    ),
    on(
      orderProcessActions.getUserAddressFailure,
      orderProcessActions.addUserAddressFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        userAddress: {
          ...state.userAddress,
          error: error.message,
          loading: false,
        },
      }),
    ),
    on(orderProcessActions.getShippingMethods, (state) => ({
      ...state,
      shippingMethodsLoading: true,
    })),
    on(
      orderProcessActions.getShippingMethodsSuccess,
      (state, { shippingMethods }) => ({
        ...state,
        shippingMethodsLoading: false,
        shippingMethods,
      }),
    ),
    on(orderProcessActions.getShippingMethodsFailure, (state, { error }) => ({
      ...state,
      shippingMethodsLoading: false,
      shippingMethodsError: error.message,
    })),
    on(orderProcessActions.getCreditCard, (state) => ({
      ...state,
      creditCard: {
        ...state.creditCard,
        loading: true,
      },
    })),
    on(
      orderProcessActions.getCreditCardSuccess,
      (state, { creditCard }): OrderProcessState => ({
        ...state,
        creditCard: {
          ...state.creditCard,
          data: creditCard,
          loading: false,
        },
      }),
    ),
    on(orderProcessActions.getCreditCardFailure, (state, { error }) => ({
      ...state,
      creditCard: {
        ...state.creditCard,
        loading: false,
        error: error.message,
      },
    })),
    on(orderProcessActions.getCountries, (state) => ({
      ...state,
      countries: {
        ...state.countries,
        loading: true,
      },
    })),
    on(
      orderProcessActions.getCountriesSuccess,
      (state, { countries }): OrderProcessState => ({
        ...state,
        countries: {
          ...state.countries,
          data: countries,
          loading: false,
        },
      }),
    ),
    on(
      orderProcessActions.getCountriesFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        countries: {
          ...state.countries,
          error: error.message,
          loading: false,
        },
      }),
    ),
  ),
});
