import { createFeature, createReducer, on } from '@ngrx/store';
import {
  initialShoppingSessionState,
  ShoppingSessionState,
} from './shopping-session.state';
import { shoppingSessionActions } from './shopping-session.action';

export const shoppingSessionFeature = createFeature({
  name: 'shopping-session',
  reducer: createReducer(
    initialShoppingSessionState,
    on(
      shoppingSessionActions.getShoppingSession,
      (state): ShoppingSessionState => ({
        ...state,
      }),
    ),
    on(
      shoppingSessionActions.getShoppingSessionSuccess,
      (state, { shoppingSession }): ShoppingSessionState => ({
        ...state,
        shoppingSession,
        shoppingSessionId: shoppingSession.id,
      }),
    ),
  ),
});
