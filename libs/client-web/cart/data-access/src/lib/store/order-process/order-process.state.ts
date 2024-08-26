import {
  Country,
  CreditCardBase,
  ShippingMethod,
  UserAddress,
} from '@e-commerce/client-web/shared/data-access';
import { PaymentMethod } from '../../models/payment-method.model';

export interface OrderProcessState {
  shippingMethods: ShippingMethod[];
  shippingMethodsLoading: boolean;
  shippingMethodsError: string | string[] | null;
  creditCard: {
    data: CreditCardBase | null;
    loading: boolean;
    error: string[] | string | null;
  };
  userAddress: {
    data: UserAddress | null;
    loading: boolean;
    error: string | string[] | null;
    cache: UserAddress | null;
  };
  countries: {
    data: Country[];
    loading: boolean;
    error: string | string[] | null;
  };
  selectedShippingMethod: ShippingMethod | null;
  selectedPaymentMethod: PaymentMethod | null;
}

export const initialOrderProcessState: OrderProcessState = {
  userAddress: {
    data: null,
    loading: false,
    error: null,
    cache: null,
  },
  countries: {
    data: [],
    loading: false,
    error: null,
  },
  shippingMethods: [],
  shippingMethodsLoading: false,
  shippingMethodsError: null,
  creditCard: {
    data: null,
    loading: false,
    error: null,
  },
  selectedPaymentMethod: null,
  selectedShippingMethod: null,
};
