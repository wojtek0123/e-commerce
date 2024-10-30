import { createFeature, createReducer, on } from '@ngrx/store';
import { initialOrdersState } from './orders.state';
import { ordersActions } from './orders.actions';

export const ordersFeature = createFeature({
  name: 'orders',
  reducer: createReducer(
    initialOrdersState,
    on(ordersActions.getOrders, (state) => ({
      ...state,
      loading: true,
    })),
    on(ordersActions.getOrdersSuccess, (state, { orders }) => ({
      ...state,
      loading: false,
      orders,
    })),
    on(ordersActions.getOrdersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: error.error.message,
    })),
  ),
});
