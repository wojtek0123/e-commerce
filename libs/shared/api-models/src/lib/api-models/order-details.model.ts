import { PaymentDetails, OrderStatus } from '@prisma/client';
import { Book } from './book.model';
import { ShippingMethod } from './shipping-method.model';
import { OrderAddress } from './order-address.model';

export interface OrderDetailsBase {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

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
  OrderStatus.NEW,
  OrderStatus.PREPARED_FOR_SHIPPING,
  OrderStatus.PACKING,
  OrderStatus.SHIPPED,
];
