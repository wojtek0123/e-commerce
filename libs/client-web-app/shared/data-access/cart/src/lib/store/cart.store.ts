import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Book,
  CartItem,
  ResponseError,
  ShoppingSession,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CartItemsApiService } from '../services/cart-items-api.service';
import { ShoppingSessionApiService } from '../services/shopping-session-api.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { MessageService } from 'primeng/api';

interface CartState {
  shoppingSessionId: ShoppingSession['id'] | null;
  total: ShoppingSession['total'];
  cartItems: ShoppingSession['cartItems'];
  loading: boolean;
  error: string | null;
}

const initialCartState: CartState = {
  shoppingSessionId: null,
  total: 0,
  cartItems: [],
  loading: false,
  error: null,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialCartState),
  withComputed(({ cartItems }) => ({
    count: computed(() => cartItems().length),
  })),
  withMethods(
    (
      store,
      shoppingSessionApi = inject(ShoppingSessionApiService),
      cartItemsApi = inject(CartItemsApiService),
      messageService = inject(MessageService)
    ) => ({
      getShoppingSession: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            shoppingSessionApi.getShoppingSession().pipe(
              tapResponse({
                next: ({ total, cartItems, id }) => {
                  patchState(store, {
                    shoppingSessionId: id,
                    total,
                    cartItems,
                    loading: false,
                  });
                },
                error: (responseError: ResponseError) => {
                  patchState(store, {
                    error: responseError.error.message,
                    loading: false,
                  });
                },
              })
            )
          )
        )
      ),
      addItemToCart: rxMethod<{ bookId: Book['id']; quantity: number }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          filter(() => !!store.shoppingSessionId),
          switchMap(({ bookId, quantity }) =>
            cartItemsApi
              .createCartItem({
                bookId,
                quantity,
                shoppingSessionId: store.shoppingSessionId()!,
              })
              .pipe(
                tapResponse({
                  next: (cartItem) => {
                    const existing = store
                      .cartItems()
                      .find((item) => item.bookId === cartItem.bookId);
                    patchState(store, (state) => ({
                      cartItems: existing
                        ? state.cartItems.map((item) =>
                            item.id === existing.id
                              ? {
                                  ...item,
                                  quantity: cartItem.quantity,
                                }
                              : item
                          )
                        : [...state.cartItems, cartItem],
                      total:
                        state.total + cartItem.book.price * cartItem.quantity,
                      loading: false,
                      error: null,
                    }));
                    messageService.add({
                      summary: 'Success',
                      detail: `${cartItem.book.title} has been added to cart successfully`,
                      severity: 'success',
                    });
                  },
                  error: (resError: ResponseError) => {
                    patchState(store, { loading: false });
                    messageService.add({
                      summary: 'Error',
                      detail: resError.error?.message ?? 'error has occur',
                      severity: 'error',
                    });
                  },
                })
              )
          )
        )
      ),
      removeFromCart: rxMethod<{ cartId: CartItem['id'] }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ cartId }) =>
            cartItemsApi.deleteCartItem(cartId).pipe(
              tapResponse({
                next: (cartItem) => {
                  patchState(store, (state) => ({
                    total:
                      state.total - cartItem.book.price * cartItem.quantity,
                    cartItems: state.cartItems.filter(
                      (item) => item.id !== cartItem.id
                    ),
                  }));
                  messageService.add({
                    summary: 'Success',
                    detail: `${cartItem.book.title} has been removed from the cart`,
                    severity: 'success',
                  });
                },
                error: (resError: ResponseError) => {
                  messageService.add({
                    summary: 'Error',
                    detail: resError.error.message,
                    severity: 'error',
                  });
                },
              })
            )
          )
        )
      ),
      updateQuantity: rxMethod<{
        cartId: CartItem['id'];
        quantity: CartItem['quantity'];
      }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ cartId, quantity }) =>
            cartItemsApi.updateQuantity(cartId, { quantity }).pipe(
              tapResponse({
                next: (cartItem) => {
                  const cartItems = store
                    .cartItems()
                    .map((item) =>
                      item.id === cartItem.id
                        ? { ...item, quantity: cartItem.quantity }
                        : item
                    );
                  patchState(store, {
                    cartItems,
                    total: cartItems.reduce(
                      (acc, cur) => acc + cur.book.price * cur.quantity,
                      0
                    ),
                  });
                  messageService.add({
                    summary: 'Success',
                    detail: `Quantity has been updated to ${quantity} ${
                      quantity === 1 ? 'unit' : 'units'
                    }`,
                    severity: 'success',
                  });
                },
                error: (resError: ResponseError) => {
                  messageService.add({
                    summary: 'Error',
                    detail: resError.error.message,
                    severity: 'error',
                  });
                },
              })
            )
          )
        )
      ),
    })
  ),
  withHooks({
    onInit: (store) => {
      store.getShoppingSession();
    },
  })
);
