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
  bookIds: Book['id'][];
  total: ShoppingSession['total'];
  cartItems: ShoppingSession['cartItems'];
  loading: boolean;
  error: string | null;
}

const initialCartState: CartState = {
  shoppingSessionId: null,
  bookIds: [],
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
          filter(() => !!store.shoppingSessionId),
          tap(({ bookId }) =>
            patchState(store, (state) => ({
              loading: true,
              bookIds: [...state.bookIds, bookId],
            }))
          ),
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
                    patchState(store, (state) => {
                      const existing = state.cartItems.find(
                        (item) => item.bookId === cartItem.bookId
                      );

                      const cartItems = existing
                        ? state.cartItems.map((item) =>
                            item.id === existing.id
                              ? {
                                  ...item,
                                  quantity: cartItem.quantity,
                                }
                              : item
                          )
                        : [...state.cartItems, cartItem];

                      return {
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
                        total: cartItems.reduce(
                          (acc, cur) => acc + cur.book.price * cur.quantity,
                          0
                        ),
                        loading: false,
                        bookIds: state.bookIds.filter((id) => id !== bookId),
                        error: null,
                      };
                    });
                    messageService.add({
                      summary: 'Success',
                      detail: `${cartItem.book.title} has been added to cart successfully`,
                      severity: 'success',
                    });
                  },
                  error: (resError: ResponseError) => {
                    patchState(store, (state) => ({
                      loading: false,
                      bookIds: state.bookIds.filter((id) => id !== bookId),
                    }));
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
      removeItemFromCart: rxMethod<{ cartId: CartItem['id'] }>(
        pipe(
          filter(() => !!store.shoppingSessionId),
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
                    loading: false,
                  }));
                  messageService.add({
                    summary: 'Success',
                    detail: `${cartItem.book.title} has been removed from the cart`,
                    severity: 'success',
                  });
                },
                error: (resError: ResponseError) => {
                  patchState(store, {
                    loading: false,
                    error: resError.error.message,
                  });
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
                    loading: false,
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
                  patchState(store, {
                    loading: false,
                    error: resError.error.message,
                  });
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
