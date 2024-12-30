import { computed, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import {
  Book,
  CartItemBase,
  ResponseError,
  ShoppingSession,
} from '@e-commerce/shared/api-models';
import {
  CartItemsApiService,
  ShoppingSessionApiService,
} from '@e-commerce/client-web/shared/data-access/api-services';
import {
  getState,
  patchState,
  signalStore,
  type,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { MessageService } from 'primeng/api';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, of, pipe, switchMap, tap } from 'rxjs';
import { mapResponse, tapResponse } from '@ngrx/operators';
import {
  addEntities,
  addEntity,
  entityConfig,
  removeAllEntities,
  removeEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { APP_LOCAL_STORAGE_KEYS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

interface CartState {
  shoppingSession: ShoppingSession | null;
  shoppingSessionId: ShoppingSession['id'] | null;
  cartItemsCached: CartItemBase[];
  isDrawerVisible: boolean;

  loading: boolean;
  error: string | null;
}

const initialCartState: CartState = {
  shoppingSession: null,
  shoppingSessionId: null,
  cartItemsCached: [],
  loading: false,
  error: null,
  isDrawerVisible: false,
};

const cartItemsConfig = entityConfig({
  entity: type<CartItemBase>(),
  collection: '_cartItems',
  selectId: (cartItem) => cartItem.book.id,
});

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialCartState),
  withEntities(cartItemsConfig),
  withComputed(({ _cartItemsEntities }) => ({
    itemsCount: computed(() => _cartItemsEntities().length),
    cartItems: computed(() => _cartItemsEntities()),
    total: computed(() =>
      _cartItemsEntities().reduce(
        (acc, ct) => acc + ct.book.price * ct.quantity,
        0,
      ),
    ),
  })),
  withMethods(
    (
      store,
      shoppingSessionApi = inject(ShoppingSessionApiService),
      cartItemApi = inject(CartItemsApiService),
      messageService = inject(MessageService),
      appLocalStorageKeys = inject(APP_LOCAL_STORAGE_KEYS_TOKEN),
    ) => ({
      syncCartAndFetchSession: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          map(() => ({
            shoppingSessionId: store.shoppingSessionId(),
            cartItems: store._cartItemsEntities(),
          })),
          switchMap(({ shoppingSessionId, cartItems }) => {
            if (!shoppingSessionId || cartItems.length === 0) {
              return of(null);
            }

            return shoppingSessionApi
              .createManyCartItems(
                shoppingSessionId,
                cartItems.map((ct) => ({
                  bookId: ct.book.id,
                  quantity: ct.quantity,
                })),
              )
              .pipe(
                mapResponse({
                  next: () => {
                    messageService.add({
                      summary: 'Success',
                      detail:
                        'Your cart items has been combined with items from previous session',
                      severity: 'success',
                    });
                  },
                  error: () => {
                    messageService.add({
                      summary: 'Error',
                      detail: `Your cart items hasn't been combined with items from previous session.`,
                      severity: 'error',
                    });
                  },
                }),
              );
          }),
          switchMap(() =>
            shoppingSessionApi.getShoppingSession().pipe(
              tapResponse({
                next: (shoppingSession) => {
                  localStorage.removeItem(appLocalStorageKeys.CART);
                  patchState(
                    store,
                    {
                      shoppingSession,
                      shoppingSessionId: shoppingSession.id,
                      loading: false,
                    },
                    addEntities(
                      shoppingSession.cartItems.map((ct) => ({
                        book: ct.book,
                        quantity: ct.quantity,
                      })),
                      cartItemsConfig,
                    ),
                  );
                },
                error: (error: ResponseError) => {
                  patchState(store, {
                    loading: false,
                    error:
                      error?.error?.message ||
                      'An error has occurred while getting shopping session',
                  });
                },
              }),
            ),
          ),
        ),
      ),
      addBook: rxMethod<{ book: Book; quantity: number }>(
        pipe(
          tap(({ book, quantity }) => {
            const isInCart = !!getState(store)._cartItemsIds.find(
              (id) => id === book.id,
            );
            patchState(
              store,
              (state) => ({
                cartItemsCached: Object.values(state._cartItemsEntityMap) ?? [],
              }),
              isInCart
                ? updateEntity(
                    {
                      id: book.id,
                      changes: (cartItem) => ({
                        quantity: cartItem.quantity + quantity,
                      }),
                    },
                    cartItemsConfig,
                  )
                : addEntity({ book, quantity }, cartItemsConfig),
            );

            messageService.add({
              summary: 'Success',
              detail: `${book.title} has been added to cart`,
              severity: 'success',
            });
          }),
          filter(() => !!store.shoppingSessionId()),
          switchMap(({ book, quantity }) =>
            cartItemApi.createCartItem({ bookId: book.id, quantity }).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => ({
                    cartItemsCached:
                      Object.values(state._cartItemsEntityMap) ?? [],
                  }));
                },
                error: (error: ResponseError) => {
                  messageService.add({
                    summary: 'Error',
                    detail:
                      error?.error?.message ||
                      'An error has occurred while adding book to cart',
                    severity: 'error',
                  });

                  const cachedCartItem = store
                    .cartItemsCached()
                    .find((ct) => ct.book.id);

                  if (cachedCartItem) {
                    patchState(
                      store,
                      updateEntity(
                        {
                          id: book.id,
                          changes: {
                            quantity: cachedCartItem.quantity,
                          },
                        },
                        cartItemsConfig,
                      ),
                    );
                  } else {
                    patchState(store, removeEntity(book.id, cartItemsConfig));
                  }
                },
              }),
            ),
          ),
        ),
      ),
      updateQuantity: rxMethod<{ bookId: Book['id']; quantity: number }>(
        pipe(
          tap(({ bookId, quantity }) => {
            patchState(
              store,
              (state) => ({
                cartItemsCached: Object.values(state._cartItemsEntityMap) ?? [],
              }),
              updateEntity(
                { id: bookId, changes: { quantity } },
                cartItemsConfig,
              ),
            );

            messageService.add({
              summary: 'Success',
              detail: 'Quantity has been updated',
              severity: 'success',
            });
          }),
          map(({ bookId, quantity }) => ({
            bookId,
            quantity,
            shoppingSessionId: getState(store).shoppingSessionId,
          })),
          filter(({ shoppingSessionId }) => !!shoppingSessionId),
          switchMap(({ bookId, quantity, shoppingSessionId }) =>
            cartItemApi
              .updateQuantity(shoppingSessionId ?? '', bookId, {
                quantity,
              })
              .pipe(
                tapResponse({
                  next: () => {
                    patchState(store, (state) => ({
                      ...state,
                      cartItemsCached:
                        Object.values(state._cartItemsEntityMap) ?? [],
                    }));
                  },
                  error: () => {
                    messageService.add({
                      summary: 'Error',
                      detail:
                        'Error occur while updating quantity. Change has been withdrawn.',
                      severity: 'error',
                    });

                    const cachedCartItem = store
                      .cartItemsCached()
                      .find((ct) => ct.book.id === bookId);

                    if (cachedCartItem)
                      patchState(
                        store,
                        updateEntity(
                          {
                            id: bookId,
                            changes: { quantity: cachedCartItem.quantity },
                          },
                          cartItemsConfig,
                        ),
                      );
                  },
                }),
              ),
          ),
        ),
      ),
      removeBook: rxMethod<{ bookId: Book['id'] }>(
        pipe(
          tap(({ bookId }) => {
            patchState(
              store,
              (state) => ({
                cartItemsCached: Object.values(state._cartItemsEntityMap) ?? [],
              }),
              removeEntity(bookId, cartItemsConfig),
            );

            messageService.add({
              summary: 'Success',
              detail: 'Book has been removed from cart',
              severity: 'success',
            });
          }),
          filter(() => !!store.shoppingSessionId()),
          switchMap(({ bookId }) =>
            cartItemApi
              .deleteCartItem(store.shoppingSessionId() ?? '', bookId)
              .pipe(
                tapResponse({
                  next: () => {
                    patchState(store, (state) => ({
                      ...state,
                      cartItemsCached:
                        Object.values(state._cartItemsEntityMap) ?? [],
                    }));
                  },
                  error: () => {
                    messageService.add({
                      summary: 'Error',
                      detail: 'Error occur while removing the book quantity',
                      severity: 'error',
                    });

                    const cachedCartItem = store
                      .cartItemsCached()
                      .find((ct) => ct.book.id === bookId);

                    if (cachedCartItem)
                      patchState(
                        store,
                        addEntity(
                          {
                            book: cachedCartItem.book,
                            quantity: cachedCartItem.quantity,
                          },
                          cartItemsConfig,
                        ),
                      );
                  },
                }),
              ),
          ),
        ),
      ),
      deleteSession: rxMethod<void>(
        pipe(
          switchMap(() =>
            shoppingSessionApi.delete().pipe(
              tapResponse({
                next: () => {
                  patchState(
                    store,
                    { shoppingSession: null, shoppingSessionId: null },
                    removeAllEntities(cartItemsConfig),
                  );
                },
                error: (error: ResponseError) => {
                  messageService.add({
                    summary: 'Error',
                    detail:
                      error?.error?.message ??
                      'An error occured while deleting shopping session',
                    severity: 'error',
                  });
                },
              }),
            ),
          ),
        ),
      ),
      clearCartAndSession: () => {
        patchState(
          store,
          { shoppingSessionId: null, shoppingSession: null },
          removeAllEntities(cartItemsConfig),
        );
      },
      getLocalCartItems: () => {
        const cartItems = JSON.parse(
          localStorage.getItem(appLocalStorageKeys.CART) || '[]',
        ) as CartItemBase[];

        patchState(store, addEntities([...cartItems], cartItemsConfig));
      },
      openDrawerCart: () => {
        patchState(store, { isDrawerVisible: true });
      },
      closeDrawerCart: () => {
        patchState(store, { isDrawerVisible: false });
      },
    }),
  ),
  withHooks({
    onInit(
      store,
      appLocalStorageKeys = inject(APP_LOCAL_STORAGE_KEYS_TOKEN),
      router = inject(Router),
      destroyRef = inject(DestroyRef),
      platform = inject(PLATFORM_ID),
    ) {
      if (isPlatformBrowser(platform)) {
        watchState(store, (state) => {
          if (!state.shoppingSessionId) {
            localStorage.setItem(
              appLocalStorageKeys.CART,
              JSON.stringify(Object.values(state._cartItemsEntityMap)),
            );
          }
        });
      }

      router.events
        .pipe(
          filter(
            (events) =>
              events instanceof NavigationEnd &&
              getState(store).isDrawerVisible,
          ),
          takeUntilDestroyed(destroyRef),
        )
        .subscribe(() => {
          store.closeDrawerCart();
        });
    },
  }),
);
