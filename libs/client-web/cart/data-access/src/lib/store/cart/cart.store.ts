import {
  afterNextRender,
  computed,
  DestroyRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
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
  withProps,
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
  withProps(() => ({
    shoppingSessionApi: inject(ShoppingSessionApiService),
    cartItemApi: inject(CartItemsApiService),
    messageService: inject(MessageService),
    appLocalStorageKeys: inject(APP_LOCAL_STORAGE_KEYS_TOKEN),
    router: inject(Router),
    destroyRef: inject(DestroyRef),
    platform: inject(PLATFORM_ID),
  })),
  withMethods((store) => ({
    // TODO: call after shopping session is done
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

          return store.shoppingSessionApi
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
                  store.messageService.add({
                    summary: 'Success',
                    detail:
                      'Your cart items has been combined with items from previous session',
                    severity: 'success',
                  });
                },
                error: () => {
                  store.messageService.add({
                    summary: 'Error',
                    detail: `Your cart items hasn't been combined with items from previous session.`,
                    severity: 'error',
                  });
                },
              }),
            );
        }),
        switchMap(() =>
          store.shoppingSessionApi.getShoppingSession().pipe(
            tapResponse({
              next: (shoppingSession) => {
                localStorage.removeItem(store.appLocalStorageKeys.CART);
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
    getNewShoppingSessionAfterPurchase: rxMethod<void>(
      pipe(
        switchMap(() =>
          store.shoppingSessionApi.getShoppingSession().pipe(
            tapResponse({
              next: (shoppingSession) => {
                patchState(
                  store,
                  {
                    shoppingSession,
                    shoppingSessionId: shoppingSession.id,
                  },
                  removeAllEntities(cartItemsConfig),
                );
              },
              error: (error: ResponseError) => {
                store.messageService.add({
                  detail:
                    error?.error?.message ??
                    'Error occurred while getting a session',
                  summary: 'Error',
                  severity: 'error',
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

          store.messageService.add({
            summary: 'Success',
            detail: `${book.title} has been added to cart`,
            severity: 'success',
          });
        }),
        filter(() => !!store.shoppingSessionId()),
        switchMap(({ book, quantity }) =>
          store.cartItemApi.createCartItem({ bookId: book.id, quantity }).pipe(
            tapResponse({
              next: () => {
                patchState(store, (state) => ({
                  cartItemsCached:
                    Object.values(state._cartItemsEntityMap) ?? [],
                }));
              },
              error: (error: ResponseError) => {
                store.messageService.add({
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

          store.messageService.add({
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
          store.cartItemApi
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
                  store.messageService.add({
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

          store.messageService.add({
            summary: 'Success',
            detail: 'Book has been removed from cart',
            severity: 'success',
          });
        }),
        filter(() => !!store.shoppingSessionId()),
        switchMap(({ bookId }) =>
          store.cartItemApi
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
                  store.messageService.add({
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
    clearCartAndSession: () => {
      patchState(
        store,
        { shoppingSessionId: null, shoppingSession: null },
        removeAllEntities(cartItemsConfig),
      );
    },
    getLocalCartItems: () => {
      const cartItems = JSON.parse(
        localStorage.getItem(store.appLocalStorageKeys.CART) || '[]',
      ) as CartItemBase[];

      patchState(store, addEntities([...cartItems], cartItemsConfig));
    },
    openDrawerCart: () => {
      patchState(store, { isDrawerVisible: true });
    },
    closeDrawerCart: () => {
      patchState(store, { isDrawerVisible: false });
    },
  })),
  withHooks({
    onInit(store) {
      if (isPlatformBrowser(store.platform)) {
        store.getLocalCartItems();

        watchState(store, (state) => {
          if (!state.shoppingSessionId) {
            localStorage.setItem(
              store.appLocalStorageKeys.CART,
              JSON.stringify(Object.values(state._cartItemsEntityMap)),
            );
          }
        });
      }

      store.router.events
        .pipe(
          filter(
            (events) =>
              events instanceof NavigationEnd &&
              getState(store).isDrawerVisible,
          ),
          takeUntilDestroyed(store.destroyRef),
        )
        .subscribe(() => {
          store.closeDrawerCart();
        });
    },
  }),
);
