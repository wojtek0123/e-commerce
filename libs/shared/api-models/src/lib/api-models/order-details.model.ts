import { Book } from './book.model';
import { ShippingMethod } from './shipping-method.model';
import { OrderAddress } from './order-address.model';
import { PaymentDetails } from './payment-details.model';

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
  | 'PREPARE_FOR_SHIPPING'
  | 'SHIPPED';

export interface OrderDetails extends OrderDetailsBase {
  paymentDetails: PaymentDetails;
  orderAddress: OrderAddress;
  paymentDetailsId: PaymentDetails['id'];
  shippingMethod: ShippingMethod;
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
  'PREPARE_FOR_SHIPPING',
  'SHIPPED',
];
