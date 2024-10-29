import { OrderDetails } from '@e-commerce/client-web/shared/data-access/api-models';

export interface OrdersState {
  loading: boolean;
  error: string | null;
  orders: OrderDetails[];
}

export const initialOrdersState: OrdersState = {
  loading: false,
  error: null,
  orders: [],
};
