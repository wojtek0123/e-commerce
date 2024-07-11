import { Book } from '@e-commerce/client-web-app/shared/data-access/api-types';

export interface OrderDetails {
  id: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  userAddressId: number;
  paymentDetailsId: number;
  shippingMethodId: number;
  status: 'NEW' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED';
  orderItems: OrderDetailsItem[];
}

export interface OrderDetailsItem {
  id: number;
  book: Book;
}
