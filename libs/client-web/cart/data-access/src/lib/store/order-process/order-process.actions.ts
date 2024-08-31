import {
  ResponseError,
  ShippingMethod,
  UserAddress,
  CreditCardBase,
  Country,
  CreateUserAddressBody,
  OrderDetails,
} from '@e-commerce/client-web/shared/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaymentMethod } from '../../models/payment-method.model';

export const orderProcessActions = createActionGroup({
  source: 'order-process',
  events: {
    getUserAddress: emptyProps(),
    getUserAddressSuccess: props<{ userAddress: UserAddress }>(),
    getUserAddressFailure: props<{ error: ResponseError }>(),
    addUserAddress: props<{ data: CreateUserAddressBody }>(),
    addUserAddressSucess: props<{ userAddress: UserAddress }>(),
    addUserAddressFailure: props<{ error: ResponseError }>(),
    updateUserAddress: props<{
      id: UserAddress['id'];
      data: CreateUserAddressBody & { country: Country };
    }>(),
    updateUserAddressSucess: props<{ userAddress: UserAddress }>(),
    updateUserAddressFailure: props<{ error: ResponseError }>(),

    getShippingMethods: emptyProps(),
    getShippingMethodsSuccess: props<{ shippingMethods: ShippingMethod[] }>(),
    getShippingMethodsFailure: props<{ error: ResponseError }>(),
    selectShippingMethod: props<{ shippingMethod: ShippingMethod }>(),

    getCreditCard: emptyProps(),
    getCreditCardSuccess: props<{ creditCard: CreditCardBase | null }>(),
    getCreditCardFailure: props<{ error: ResponseError }>(),
    addCreditCard: props<{
      data: { number: string; expirationDate: string; securityCode: string };
    }>(),
    addCreditCardSucess: props<{ creditCard: CreditCardBase }>(),
    addCreditCardFailure: props<{ error: ResponseError }>(),
    selectPaymentMethod: props<{ paymentMethod: PaymentMethod }>(),
    setSixDigitCode: props<{ code: string | null }>(),

    getCountries: emptyProps(),
    getCountriesSuccess: props<{ countries: Country[] }>(),
    getCountriesFailure: props<{ error: ResponseError }>(),

    checkout: emptyProps(),
    checkoutSuccess: props<{ orderDetailsId: OrderDetails['id'] }>(),
    checkoutFailure: props<{ error: ResponseError }>(),
  },
});
