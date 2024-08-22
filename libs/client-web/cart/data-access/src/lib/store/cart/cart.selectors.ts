import { createSelector } from '@ngrx/store';
import { cartFeature } from './cart.reducer';

export const {
  selectShoppingSession,
  selectShoppingSessionId,
  selectCartItems,
  selectLoading,
  selectError,
} = cartFeature;

export const selectCount = createSelector(
  selectCartItems,
  (cartItems) => cartItems.length,
);
export const selectTotal = createSelector(selectCartItems, (cartItems) =>
  cartItems.reduce((acc, ct) => acc + ct.book.price * ct.quantity, 0),
);
