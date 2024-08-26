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
      orderProcessActions.updateUserAddress,
      (state, { data }): OrderProcessState => {
        return {
          ...state,
          userAddress: {
            ...state.userAddress,
            cache: state.userAddress.data,
            data: {
              id: state.userAddress.data!.id,
              ...data,
            },
          },
        };
      },
    ),
    on(orderProcessActions.updateUserAddressSucess, (state) => ({
      ...state,
      userAddress: {
        ...state.userAddress,
        cache: null,
      },
    })),
    on(orderProcessActions.updateUserAddressFailure, (state) => ({
      ...state,
      userAddress: {
        ...state.userAddress,
        data: state.userAddress.cache,
        cache: null,
      },
    })),
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
    on(
      orderProcessActions.getShippingMethods,
      (state): OrderProcessState => ({
        ...state,
        shippingMethodsLoading: true,
      }),
    ),
    on(
      orderProcessActions.getShippingMethodsSuccess,
      (state, { shippingMethods }): OrderProcessState => ({
        ...state,
        shippingMethodsLoading: false,
        shippingMethods,
        // selectedShippingMethod: shippingMethods.at(0) ?? null,
      }),
    ),
    on(
      orderProcessActions.getShippingMethodsFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        shippingMethodsLoading: false,
        shippingMethodsError: error.message,
      }),
    ),
    on(
      orderProcessActions.getCreditCard,
      orderProcessActions.addCreditCard,
      (state): OrderProcessState => ({
        ...state,
        creditCard: {
          ...state.creditCard,
          loading: true,
        },
      }),
    ),
    on(
      orderProcessActions.getCreditCardSuccess,
      orderProcessActions.addCreditCardSucess,
      (state, { creditCard }): OrderProcessState => ({
        ...state,
        creditCard: {
          ...state.creditCard,
          data: creditCard,
          loading: false,
        },
        selectedPaymentMethod: 'credit-card',
      }),
    ),
    on(
      orderProcessActions.getCreditCardFailure,
      orderProcessActions.addCreditCardFailure,
      (state, { error }): OrderProcessState => ({
        ...state,
        creditCard: {
          ...state.creditCard,
          loading: false,
          error: error.message,
        },
      }),
    ),
    on(
      orderProcessActions.getCountries,
      (state): OrderProcessState => ({
        ...state,
        countries: {
          ...state.countries,
          loading: true,
        },
      }),
    ),
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
    on(
      orderProcessActions.selectPaymentMethod,
      (state, { paymentMethod }): OrderProcessState => ({
        ...state,
        selectedPaymentMethod: paymentMethod,
      }),
    ),
    on(
      orderProcessActions.selectShippingMethod,
      (state, { shippingMethod }): OrderProcessState => ({
        ...state,
        selectedShippingMethod: shippingMethod,
      }),
    ),
  ),
});
