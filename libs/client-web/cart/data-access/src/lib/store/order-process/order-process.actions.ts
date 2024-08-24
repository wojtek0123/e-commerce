import {
  ResponseError,
  ShippingMethod,
  UserAddress,
  CreditCardBase,
  Country,
  CreateUserAddressBody,
} from '@e-commerce/client-web/shared/data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const orderProcessActions = createActionGroup({
  source: 'order-process',
  events: {
    getUserAddress: emptyProps(),
    getUserAddressSuccess: props<{ userAddress: UserAddress }>(),
    getUserAddressFailure: props<{ error: ResponseError }>(),
    addUserAddress: props<{ data: CreateUserAddressBody }>(),
    addUserAddressSucess: props<{ userAddress: UserAddress }>(),
    addUserAddressFailure: props<{ error: ResponseError }>(),

    getShippingMethods: emptyProps(),
    getShippingMethodsSuccess: props<{ shippingMethods: ShippingMethod[] }>(),
    getShippingMethodsFailure: props<{ error: ResponseError }>(),

    getCreditCard: emptyProps(),
    getCreditCardSuccess: props<{ creditCard: CreditCardBase }>(),
    getCreditCardFailure: props<{ error: ResponseError }>(),

    getCountries: emptyProps(),
    getCountriesSuccess: props<{ countries: Country[] }>(),
    getCountriesFailure: props<{ error: ResponseError }>(),
  },
});
