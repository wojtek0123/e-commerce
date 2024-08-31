import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  OrderDetails,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';

export const ordersActions = createActionGroup({
  source: 'orders',
  events: {
    getOrders: emptyProps(),
    getOrdersSuccess: props<{ orders: OrderDetails[] }>(),
    getOrdersFailure: props<{ error: ResponseError }>(),
  },
});
