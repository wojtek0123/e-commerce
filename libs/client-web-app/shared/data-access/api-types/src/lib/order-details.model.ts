import { ShippingMethod } from './models/shipping-method.model';
import { UserAddress } from './models/user-address.model';

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
