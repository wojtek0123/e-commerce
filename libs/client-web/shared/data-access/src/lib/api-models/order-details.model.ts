import { Book } from './book.model';
import { ShippingMethod } from './shipping-method.model';
import { UserAddress } from './user-address.model';

export interface OrderDetails {
  id: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  userAddress: UserAddress;
  paymentDetailsId: number;
  shippingMethod: ShippingMethod;
  paymentDetails: {
    provider: string;
    status: string;
  };
  status: OrderDetailsStatus;
  orderItems: OrderDetailsItem[];
}

export interface OrderDetailsItem {
  id: number;
  book: Book;
  quantity: number;
}

export type OrderDetailsStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED';

export const orderDetailsStatuses: OrderDetailsStatus[] = [
  'NEW',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
];
