import { createSelector } from '@ngrx/store';
import { orderProcessFeature } from './order-process.reducer';

const { selectAddress, selectPayment, selectShipping } = orderProcessFeature;

const selectCreditCard = createSelector(
  selectPayment,
  (payment) => payment.creditCard,
);

const selectCountries = createSelector(
  selectAddress,
  (address) => address.countries,
);

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
  selectAddress,
  (userAddress) => userAddress.data,
);

export const selectUserAddressLoading = createSelector(
  selectAddress,
  (userAddress) => userAddress.loading,
);

export const selectUserAddressError = createSelector(
  selectAddress,
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
  selectShipping,
  (shipping) => shipping.selectedShippingMethod?.price ?? 0,
);

export const selectSelectedPaymentMethod = createSelector(
  selectPayment,
  (payment) => payment.selectedPaymentMethod,
);

export const selectSixDigitCode = createSelector(
  selectPayment,
  (payment) => payment.sixDigitCode,
);

export const selectIsSixDigitCodeInvalid = createSelector(
  selectSixDigitCode,
  selectSelectedPaymentMethod,
  (sixDigitCode, selectedPaymentMethod) =>
    sixDigitCode?.length !== 6 && selectedPaymentMethod === '6-digit-code',
);

export const selectSelectedShippingMethod = createSelector(
  selectShipping,
  (shipping) => shipping.selectedShippingMethod,
);

export const selectShippingMethods = createSelector(
  selectShipping,
  (shipping) => shipping.data,
);

export const selectShippingMethodsLoading = createSelector(
  selectShipping,
  (shipping) => shipping.loading,
);

export const selectShippingMethodsError = createSelector(
  selectShipping,
  (shipping) => shipping.error,
);

export const selectIsCreditCardInvalid = createSelector(
  selectCreditCardData,
  selectSelectedPaymentMethod,
  (creditCard, selectedPaymentMethod) =>
    !creditCard && selectedPaymentMethod === 'credit-card',
);

export const selectIsPaymentInvalid = createSelector(
  selectIsSixDigitCodeInvalid,
  selectIsCreditCardInvalid,
  (isSixDigitCodeInvalid, isCreditCardInvalid) =>
    isSixDigitCodeInvalid || isCreditCardInvalid,
);
