import {
  Book,
  ShippingMethod,
  UserAddress,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

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
  status: orderDetailsStatus;
  orderItems: OrderDetailsItem[];
}

export interface OrderDetailsItem {
  id: number;
  book: Book;
  quantity: number;
}

type orderDetailsStatus = 'NEW' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED';

export const orderDetailsStatuses: orderDetailsStatus[] = [
  'NEW',
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
];
