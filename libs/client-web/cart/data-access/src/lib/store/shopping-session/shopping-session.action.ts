import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ShoppingSession,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';

export const shoppingSessionActions = createActionGroup({
  source: 'shopping-session',
  events: {
    getShoppingSession: emptyProps(),
    getShoppingSessionSuccess: props<{ shoppingSession: ShoppingSession }>(),
    getShoppingSessionFailure: props<{ error: ResponseError }>(),
  },
});
