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
  CartItemBase,
  ResponseError,
  ShoppingSession,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CartItemsApiService } from '../services/cart-items-api.service';
import { ShoppingSessionApiService } from '../services/shopping-session-api.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { MessageService } from 'primeng/api';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';

interface CartState {
  shoppingSessionId: ShoppingSession['id'] | null;
  bookIds: Book['id'][];
  total: ShoppingSession['total'];
  cartItems: CartItem[];
  localStorageItems: CartItemBase[];
  loading: boolean;
  error: string | null;
}

const initialCartState: CartState = {
  shoppingSessionId: null,
  bookIds: [],
  total: 0,
  cartItems: [],
  localStorageItems: [],
  loading: false,
  error: null,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialCartState),
  withComputed(({ cartItems, shoppingSessionId, localStorageItems }) => ({
    count: computed(() =>
      shoppingSessionId() ? cartItems().length : localStorageItems().length
    ),
    items: computed(() =>
      shoppingSessionId() ? cartItems() : localStorageItems()
    ),
  })),
  withMethods(
    (
      store,
      shoppingSessionApi = inject(ShoppingSessionApiService),
      cartItemsApi = inject(CartItemsApiService),
      authService = inject(AuthService),
      messageService = inject(MessageService)
    ) => ({
      getShoppingSession: rxMethod<void>(
        pipe(
          tap(() => {
            if (!authService.getSession()) {
              const cart = localStorage.getItem('cart');
              let cartItems: CartItemBase[] = [];
              if (cart) {
                cartItems = JSON.parse(cart);
              }
              patchState(store, {
                localStorageItems: cartItems,
                total: cartItems.reduce(
                  (acc, item) => acc + item.book.price * item.quantity,
                  0
                ),
              });
            }
          }),
          filter(() => !!authService.getSession()),
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

                  localStorage.setItem('cart', JSON.stringify(cartItems));
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
      addItemToCart: rxMethod<{ book: Book; quantity: number }>(
        pipe(
          tap(({ book, quantity }) => {
            if (!authService.getSession()) {
              const cart = localStorage.getItem('cart');
              let cartItems: CartItemBase[] = [];
              if (cart) {
                cartItems = JSON.parse(cart) as CartItemBase[];
              }

              const isInTheCart = cartItems.find(
                (item) => item.book.id === book.id
              );

              if (isInTheCart) {
                const updatedBooks = cartItems.map((item) =>
                  item.book.id === book.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                );

                localStorage.setItem('cart', JSON.stringify(updatedBooks));
                patchState(store, {
                  localStorageItems: updatedBooks,
                  total: updatedBooks.reduce(
                    (acc, item) => acc + item.book.price * item.quantity,
                    0
                  ),
                });
              } else {
                localStorage.setItem(
                  'cart',
                  JSON.stringify([...cartItems, { book, quantity }])
                );
                const updatedCartItems = [...cartItems, { book, quantity }];
                patchState(store, {
                  localStorageItems: updatedCartItems,
                  total: updatedCartItems.reduce(
                    (acc, item) => acc + item.book.price * item.quantity,
                    0
                  ),
                });
              }
            }
            messageService.add({
              summary: 'Success',
              detail: `${book.title} has been added to cart`,
              severity: 'success',
            });
          }),
          filter(() => !!store.shoppingSessionId && !!authService.getSession()),
          tap(({ book: { id: bookId } }) =>
            patchState(store, (state) => ({
              loading: true,
              bookIds: [...state.bookIds, bookId],
            }))
          ),
          switchMap(({ book: { id: bookId }, quantity }) =>
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
                      detail: `${cartItem.book.title} has been added to cart`,
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
      removeItemFromCart: rxMethod<{
        book: Book;
      }>(
        pipe(
          tap(({ book }) => {
            if (!authService.getSession()) {
              const cart = localStorage.getItem('cart');
              if (!cart) return;
              const cartItems = JSON.parse(cart) as CartItemBase[];
              const updatedBooks = cartItems.filter(
                ({ book: { id } }) => id !== book.id
              );
              localStorage.setItem('cart', JSON.stringify(updatedBooks));
              patchState(store, (state) => ({
                total: updatedBooks.reduce(
                  (acc, item) => acc + item.book.price * item.quantity,
                  0
                ),
                localStorageItems: state.localStorageItems.filter(
                  (item) => item.book.id !== book.id
                ),
              }));
              messageService.add({
                summary: 'Success',
                detail: `${book.title} has been removed from the cart`,
                severity: 'success',
              });
            }
          }),
          filter(() => !!store.shoppingSessionId && !!authService.getSession()),
          map(
            ({ book: { id: bookId } }) =>
              store.cartItems().find(({ book: { id } }) => id === bookId)?.id
          ),
          filter((cartId) => !!cartId),
          tap(() => patchState(store, { loading: true })),
          switchMap((cartId) =>
            cartItemsApi.deleteCartItem(cartId!).pipe(
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
        bookId: CartItem['id'];
        quantity: CartItem['quantity'];
      }>(
        pipe(
          tap(({ bookId, quantity }) => {
            if (!authService.getSession()) {
              const cart = localStorage.getItem('cart');
              if (!cart) return;
              const cartItems = JSON.parse(cart) as CartItemBase[];
              const updatedBooks = cartItems.map((item) =>
                item.book.id === bookId ? { ...item, quantity } : item
              );
              localStorage.setItem('cart', JSON.stringify(updatedBooks));
              patchState(store, {
                localStorageItems: updatedBooks,
                total: updatedBooks.reduce(
                  (acc, item) => acc + item.book.price * item.quantity,
                  0
                ),
              });
            }
          }),
          filter(() => !!authService.getSession()),
          tap(() => patchState(store, { loading: true })),
          map(({ bookId, quantity }) => ({
            cartId: store.cartItems().find((item) => item.bookId === bookId)
              ?.id,
            quantity,
          })),
          filter((cartId) => !!cartId),
          switchMap(({ cartId, quantity }) =>
            cartItemsApi.updateQuantity(cartId!, { quantity }).pipe(
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
      syncDatabaseAndLocalstorage: () => {
        // patchState(store, (state) => )
        console.log('sync');
      },
    })
  ),
  withHooks({
    onInit: (store) => {
      store.getShoppingSession();
    },
  })
);
