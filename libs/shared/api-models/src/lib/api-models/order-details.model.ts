import { Book } from './book.model';
import { ShippingMethod } from './shipping-method.model';
import { OrderAddress } from './order-address.model';
import { PaymentDetails } from './payment-details.model';
import { UserInformation } from './user-information.model';
import { OrderShippingMethod } from './order-shipping-method.model';

export interface OrderDetailsBase {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'NEW'
  | 'PACKING'
  | 'PREPARED_FOR_SHIPPING'
  | 'SHIPPED';

export interface OrderDetails extends OrderDetailsBase {
  paymentDetails: PaymentDetails;
  orderAddress: OrderAddress;
  orderUserInformation: UserInformation;
  paymentDetailsId: PaymentDetails['id'];
  orderShippingMethod: OrderShippingMethod;
  orderItems: OrderDetailsItem[];
}

export interface OrderDetailsItem {
  id: string;
  book: Book;
  quantity: number;
}

export const orderDetailsStatuses: OrderStatus[] = [
  'NEW',
  'PACKING',
  'PREPARED_FOR_SHIPPING',
  'SHIPPED',
];
