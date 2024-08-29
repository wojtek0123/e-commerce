import {
  Country,
  CreditCardBase,
  ShippingMethod,
  UserAddress,
} from '@e-commerce/client-web/shared/data-access';
import { PaymentMethod } from '../../models/payment-method.model';

export interface OrderProcessState {
  address: {
    data: UserAddress | null;
    loading: boolean;
    error: string | string[] | null;
    cache: UserAddress | null;
    countries: {
      data: Country[];
      loading: boolean;
      error: string | null;
    };
  };
  shipping: {
    data: ShippingMethod[];
    loading: boolean;
    error: string | null;
    selectedShippingMethod: ShippingMethod | null;
  };
  payment: {
    creditCard: {
      data: CreditCardBase | null;
      loading: boolean;
      error: string | null;
      isEditing: boolean;
    };
    sixDigitCode: string | null;
    selectedPaymentMethod: PaymentMethod | null;
  };
}

export const initialOrderProcessState: OrderProcessState = {
  address: {
    data: null,
    loading: false,
    error: null,
    cache: null,
    countries: {
      data: [],
      loading: false,
      error: null,
    },
  },
  shipping: {
    data: [],
    loading: false,
    error: null,
    selectedShippingMethod: null,
  },
  payment: {
    creditCard: {
      data: null,
      loading: false,
      error: null,
      isEditing: false,
    },
    sixDigitCode: null,
    selectedPaymentMethod: null,
  },
};
