import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ShoppingSession,
  ResponseError,
  Book,
} from '@e-commerce/client-web/shared/data-access';

export const cartActions = createActionGroup({
  source: 'cart',
  events: {
    getShoppingSession: emptyProps(),
    getShoppingSessionSuccess: props<{ shoppingSession: ShoppingSession }>(),
    getShoppingSessionFailure: props<{ error: ResponseError }>(),

    addBookToCart: props<{ book: Book; quantity: number }>(),
    addBookToCartSuccess: props<{ book: Book; quantity: number }>(),
    addBookToCartFailure: props<{ error: ResponseError }>(),
    addBookToCartLocally: props<{ book: Book; quantity: number }>(),

    updateQuantity: props<{ book: Book; quantity: number }>(),
    updateQuantitySuccess: props<{ book: Book; quantity: number }>(),
    updateQuantituFailure: props<{ error: ResponseError }>(),
    updateQuantityLocally: props<{ book: Book; quantity: number }>(),

    removeBookFromCart: props<{ bookId: Book['id'] }>(),
    removeBookFromCartSuccess: props<{ bookId: Book['id'] }>(),
    removeBookFromCartFailure: props<{ error: ResponseError }>(),
    removeBookFromCartLocally: props<{ bookId: Book['id'] }>(),

    checkout: emptyProps(),
    checkoutSuccess: emptyProps(),
    checkoutFailure: emptyProps(),

    syncDatabase: props<{ shoppingSessionId: ShoppingSession['id'] }>(),
    syncDatabaseSuccess: props<{ shoppingSession: ShoppingSession }>(),
    syncDatabaseFailure: props<{ error: ResponseError }>(),

    clearCart: emptyProps(),
  },
});
