import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { cartActions } from './cart.actions';
import { filter, map, switchMap, tap } from 'rxjs';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import {
  CartItemsApiService,
  ResponseError,
  ShoppingSessionApiService,
} from '@e-commerce/client-web/shared/data-access';
import { Store } from '@ngrx/store';
import { selectCartItems, selectShoppingSessionId } from './cart.selectors';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable()
export class CartEffect {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly shoppingSessionApi = inject(ShoppingSessionApiService);
  private readonly cartItemApi = inject(CartItemsApiService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  getShoppingSession = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.getShoppingSession),
      concatLatestFrom(() => this.store.select(selectCartItems)),
      switchMap(([, cartItems]) =>
        this.shoppingSessionApi.getShoppingSession().pipe(
          mapResponse({
            next: (shoppingSession) => {
              if (cartItems.length !== 0) {
                return cartActions.syncDatabase({
                  shoppingSessionId: shoppingSession.id,
                });
              }
              return cartActions.getShoppingSessionSuccess({
                shoppingSession,
              });
            },
            error: (error: ResponseError) => {
              return cartActions.getShoppingSessionFailure({
                error,
              });
            },
          }),
        ),
      ),
    ),
  );

  getCartItemsLocally = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.getCartItemsLocally),
      map(() => {
        const cart = localStorage.getItem('cart');
        const cartItems = cart ? JSON.parse(cart) : [];
        return cartActions.getCartItemsLocallySuccess({ cartItems });
      }),
    ),
  );

  addToCart = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.addBookToCart),
      concatLatestFrom(() => this.store.select(selectShoppingSessionId)),
      filter(([, shoppingSessionId]) => !!shoppingSessionId),
      switchMap(([{ book, quantity }]) => {
        return this.cartItemApi
          .createCartItem({ bookId: book.id, quantity })
          .pipe(
            mapResponse({
              next: (cartItem) => {
                this.messageService.add({
                  summary: 'Success',
                  detail: `${book.title} has been added to cart`,
                  severity: 'success',
                });
                return cartActions.addBookToCartSuccess({ ...cartItem });
              },
              error: (error: ResponseError) => {
                const message = error.message;
                this.messageService.add({
                  summary: 'Error',
                  detail: Array.isArray(message)
                    ? message.join(', ')
                    : (message ?? 'Error has occur while adding book to cart'),
                  severity: 'error',
                });
                return cartActions.addBookToCartFailure({ error });
              },
            }),
          );
      }),
    ),
  );

  addToCartLocally = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.addBookToCart),
      concatLatestFrom(() => [
        this.store.select(selectShoppingSessionId),
        this.store.select(selectCartItems),
      ]),
      filter(([, shoppingSessionId]) => !shoppingSessionId),
      map(([{ book, quantity }, , cartItems]) => {
        localStorage.setItem(
          'cart',
          JSON.stringify([...cartItems, { book, quantity }]),
        );

        this.messageService.add({
          summary: 'Success',
          detail: `${book.title} has been added to cart`,
          severity: 'success',
        });

        return cartActions.addBookToCartLocally({
          book: book,
          quantity: quantity,
        });
      }),
    ),
  );

  updateQuantity = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.updateQuantity),
      concatLatestFrom(() => this.store.select(selectShoppingSessionId)),
      filter(([, shoppingSessionId]) => !!shoppingSessionId),
      switchMap(([{ book, quantity }, shoppingSessionId]) =>
        this.cartItemApi
          .updateQuantity(shoppingSessionId!, book.id, { quantity })
          .pipe(
            mapResponse({
              next: () => {
                this.messageService.add({
                  summary: 'Success',
                  detail: 'Quantity has been updated',
                  severity: 'success',
                });
                return cartActions.updateQuantitySuccess({ book, quantity });
              },
              error: (error: ResponseError) => {
                const message = error.message;

                this.messageService.add({
                  summary: 'Error',
                  detail: Array.isArray(message)
                    ? message.join(', ')
                    : (message ??
                      'Error occur while updating the book quantity'),
                  severity: 'error',
                });
                return cartActions.updateQuantituFailure({ error });
              },
            }),
          ),
      ),
    ),
  );

  updateQuantityLocally = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.updateQuantity),
      concatLatestFrom(() => [
        this.store.select(selectShoppingSessionId),
        this.store.select(selectCartItems),
      ]),
      filter(([, shoppingSessionId]) => !shoppingSessionId),
      map(([{ book, quantity }, , cartItems]) => {
        const updatedCartItems = cartItems.map((ct) =>
          ct.book.id === book.id ? { book: ct.book.id, quantity } : { ...ct },
        );
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));

        this.messageService.add({
          summary: 'Success',
          detail: 'Quantity has been updated',
          severity: 'success',
        });

        return cartActions.updateQuantityLocally({
          book: book,
          quantity: quantity,
        });
      }),
    ),
  );

  removeBookFromCart = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.removeBookFromCart),
      concatLatestFrom(() => this.store.select(selectShoppingSessionId)),
      filter(([, shoppingSessionId]) => !!shoppingSessionId),
      switchMap(([{ bookId }, shoppingSessionId]) =>
        this.cartItemApi.deleteCartItem(shoppingSessionId!, bookId).pipe(
          mapResponse({
            next: () => {
              this.messageService.add({
                summary: 'Success',
                detail: 'Book has been removed from cart',
                severity: 'success',
              });
              return cartActions.removeBookFromCartSuccess({ bookId });
            },
            error: (error: ResponseError) => {
              const message = error.message;
              this.messageService.add({
                summary: 'Error',
                detail: Array.isArray(message)
                  ? message.join(', ')
                  : (message ?? 'Error occur while removing the book quantity'),
                severity: 'error',
              });
              return cartActions.removeBookFromCartFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  removeBookFromCartLocally = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.removeBookFromCart),
      concatLatestFrom(() => [
        this.store.select(selectShoppingSessionId),
        this.store.select(selectCartItems),
      ]),
      filter(([, shoppingSessionId]) => !shoppingSessionId),
      map(([{ bookId }, , cartItems]) => {
        const updatedCartItems = cartItems.filter(
          (ct) => ct.book.id !== bookId,
        );
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));

        this.messageService.add({
          summary: 'Success',
          detail: 'Book has been removed from cart',
          severity: 'success',
        });

        return cartActions.removeBookFromCartLocally({
          bookId,
        });
      }),
    ),
  );

  syncDatabase = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.syncDatabase),
      concatLatestFrom(() => this.store.select(selectCartItems)),
      switchMap(([{ shoppingSessionId }, cartItems]) =>
        this.shoppingSessionApi
          .createManyCartItems(
            shoppingSessionId!,
            cartItems.map((ct) => ({
              bookId: ct.book.id,
              quantity: ct.quantity,
            })),
          )
          .pipe(
            mapResponse({
              next: (shoppingSession) => {
                localStorage.removeItem('cart');
                return cartActions.syncDatabaseSuccess({ shoppingSession });
              },
              error: (error: ResponseError) => {
                return cartActions.syncDatabaseFailure({ error });
              },
            }),
          ),
      ),
    ),
  );

  // checkout = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(cartActions.checkout),
  //       tap(() => {
  //         this.router.navigate(['/order-process']);
  //       }),
  //     ),
  //   { dispatch: false },
  // );

  clearCart = createEffect(() =>
    this.actions$.pipe(
      ofType(cartActions.clearCart),
      switchMap(() =>
        this.shoppingSessionApi.delete().pipe(
          mapResponse({
            next: () => {
              return cartActions.clearCartSuccess();
            },
            error: (error: ResponseError) => {
              return cartActions.clearCartFailure({ error });
            },
          }),
        ),
      ),
    ),
  );
}
