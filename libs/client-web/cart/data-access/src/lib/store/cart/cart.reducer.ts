import { createFeature, createReducer, on } from '@ngrx/store';
import { initialCartState, CartState } from './cart.state';
import { cartActions } from './cart.actions';

export const cartFeature = createFeature({
  name: 'shopping-session',
  reducer: createReducer(
    initialCartState,
    on(
      cartActions.getShoppingSession,
      (state): CartState => ({
        ...state,
      }),
    ),
    on(
      cartActions.getShoppingSessionSuccess,
      cartActions.syncDatabaseSuccess,
      (state, { shoppingSession }): CartState => ({
        ...state,
        shoppingSession,
        shoppingSessionId: shoppingSession.id,
        cartItems: shoppingSession.cartItems,
      }),
    ),
    on(
      cartActions.getShoppingSessionFailure,
      (state, { error }): CartState => ({
        ...state,
        error: error.message,
      }),
    ),
    on(
      cartActions.getCartItemsLocallySuccess,
      (state, { cartItems }): CartState => ({
        ...state,
        cartItems,
      }),
    ),
    on(
      cartActions.addBookToCart,
      (state): CartState => ({
        ...state,
        loading: true,
      }),
    ),
    on(
      cartActions.addBookToCartSuccess,
      cartActions.addBookToCartLocally,
      (state, { book, quantity }): CartState => {
        const cartItemIndex = state.cartItems.findIndex(
          (ct) => ct.book.id === book.id,
        );
        const cartItems = [...state.cartItems];

        if (cartItemIndex !== -1) {
          cartItems[cartItemIndex].quantity += quantity;
        } else {
          cartItems.push({ book, quantity });
        }

        return {
          ...state,
          cartItems,
          loading: false,
        };
      },
    ),
    on(
      cartActions.updateQuantity,
      (state): CartState => ({
        ...state,
        loading: true,
      }),
    ),
    on(
      cartActions.updateQuantitySuccess,
      cartActions.updateQuantityLocally,
      (state, { book, quantity }): CartState => ({
        ...state,
        cartItems: state.cartItems.map((cartItem) =>
          cartItem.book.id === book.id ? { book, quantity } : { ...cartItem },
        ),
        loading: false,
      }),
    ),
    on(
      cartActions.removeBookFromCart,
      (state): CartState => ({
        ...state,
        loading: true,
      }),
    ),
    on(
      cartActions.removeBookFromCartSuccess,
      cartActions.removeBookFromCartLocally,
      (state, { bookId }) => ({
        ...state,
        cartItems: state.cartItems.filter((ct) => ct.book.id !== bookId),
        loading: false,
      }),
    ),
    on(cartActions.clearCart, (state) => ({
      ...state,
      cartItems: [],
      shoppingSessionId: null,
      shoppingSession: null,
    })),
  ),
});
