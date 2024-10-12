import { OrderAddress, PaymentDetails } from '@prisma/client';
import { Book } from './book.model';
import { ShippingMethod } from './shipping-method.model';

export interface OrderDetails {
  id: string;
  total: number;
  status: OrderDetailsStatus;
  createdAt: string;
  updatedAt: string;
  paymentDetails: PaymentDetails;
  orderAddress: OrderAddress;
  paymentDetailsId: number;
  shippingMethod: ShippingMethod;
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
