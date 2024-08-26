import { createSelector } from '@ngrx/store';
import { orderProcessFeature } from './order-process.reducer';

export const {
  selectUserAddress,
  selectCountries,
  selectShippingMethods,
  selectShippingMethodsError,
  selectShippingMethodsLoading,
  selectCreditCard,
  selectSelectedPaymentMethod,
  selectSelectedShippingMethod,
} = orderProcessFeature;

export const selectCreditCardData = createSelector(
  selectCreditCard,
  (creditCard) => creditCard.data,
);
export const selectCreditCardLoading = createSelector(
  selectCreditCard,
  (creditCard) => creditCard.loading,
);
export const selectCreditCardError = createSelector(
  selectCreditCard,
  (creditCard) => creditCard.error,
);

export const selectUserAddressData = createSelector(
  selectUserAddress,
  (userAddress) => userAddress.data,
);
export const selectUserAddressLoading = createSelector(
  selectUserAddress,
  (userAddress) => userAddress.loading,
);
export const selectUserAddressError = createSelector(
  selectUserAddress,
  (userAddress) => userAddress.error,
);

export const selectCountriesData = createSelector(
  selectCountries,
  (countries) => countries.data,
);
export const selectCountriesLoading = createSelector(
  selectCountries,
  (countries) => countries.loading,
);
export const selectCountriesError = createSelector(
  selectCountries,
  (countries) => countries.error,
);
export const selectSelectedShippingMethodPrice = createSelector(
  selectSelectedShippingMethod,
  (selectedShippingMethod) => selectedShippingMethod?.price ?? 0,
);
