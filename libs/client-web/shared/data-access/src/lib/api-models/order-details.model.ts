import { ShippingMethod } from './shipping-method.model';
import { UserAddress } from './user-address.model';

export interface OrderDetails {
  id: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  userAddress: UserAddress;
  shippingMethod: ShippingMethod;
  paymentDetails: {
    provider: string;
    status: string;
  };
  orderItems: string[];
}
