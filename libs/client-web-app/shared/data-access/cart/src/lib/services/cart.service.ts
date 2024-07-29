import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Book,
  CartItemBase,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CartItemsApiService } from './cart-items-api.service';
import { MessageService } from 'primeng/api';
import { ShoppingSessionApiService } from './shopping-session-api.service';
import { switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsApi = inject(CartItemsApiService);
  private shoppingSessionApi = inject(ShoppingSessionApiService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  private _items = signal<CartItemBase[]>([]);
  private _total = signal(0);
  private _loading = signal(false);
  private _shoppingSessionId = signal<number | null>(null);
  private _addingBooks = signal<Book['id'][]>([]);

  public items = this._items.asReadonly();
  public count = computed(() => this._items().length);
  public total = this._total.asReadonly();
  public loading = this._loading.asReadonly();
  public addingBookIds = this._addingBooks.asReadonly();

  setShoppingSession(id: number | null) {
    this._shoppingSessionId.set(id);
  }

  getCartItems() {
    this._loading.set(true);

    this.shoppingSessionApi
      .getShoppingSession()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (session) => {
          this._loading.set(true);
          this._shoppingSessionId.set(session.id);
          this._items.set(session.cartItems);
          localStorage.removeItem(appRouterConfig.localStorage.cart);
          this._recalculateTotal();

          this._loading.set(false);
        },
        error: (resError: ResponseError) => {
          console.log('here');
          if (resError.error.statusCode === 401) {
            const cart = localStorage.getItem(
              appRouterConfig.localStorage.cart,
            );
            this._items.set(cart ? JSON.parse(cart) : []);
          }
          this._loading.set(false);
        },
      });
  }

  addItem(book: Book, quantity: number) {
    if (this._shoppingSessionId()) {
      this._addingBooks.update((prevState) => [...prevState, book.id]);
      this._loading.set(true);

      this.cartItemsApi
        .createCartItem({
          bookId: book.id,
          quantity,
          shoppingSessionId: this._shoppingSessionId()!,
        })
        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: ({ book, quantity }) => {
            this._addOrUpdateItem(book, quantity);

            this._loading.set(false);

            this._recalculateTotal();

            // TODO: sprawdzić czy da się dodać więcej niż jedną książke do koszyka na raz
            this._addingBooks.update((prevState) =>
              prevState.filter((id) => id !== book.id),
            );

            this.messageService.add({
              summary: 'Success',
              detail: `${book.title} has been added to cart`,
              severity: 'success',
            });
          },
          error: (resError: ResponseError) => {
            this._loading.set(false);
            this.messageService.add({
              summary: 'Error',
              detail:
                resError.error?.message ??
                'Error has occur while adding book to cart',
              severity: 'error',
            });
          },
        });
    } else {
      this._addOrUpdateItem(book, quantity);

      localStorage.setItem(
        appRouterConfig.localStorage.cart,
        JSON.stringify(this._items()),
      );

      this._recalculateTotal();

      this.messageService.add({
        summary: 'Success',
        detail: `${book.title} has been added to cart`,
        severity: 'success',
      });
    }
  }

  updateItemQuantity(book: Book, quantity: number) {
    if (this._shoppingSessionId()) {
      this._loading.set(true);

      this.cartItemsApi
        .updateQuantity(this._shoppingSessionId()!, book.id, { quantity })
        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this._items.update((prevState) =>
              prevState.map((item) =>
                item.book.id === book.id ? { ...item, quantity } : { ...item },
              ),
            );

            this._recalculateTotal();
            this._loading.set(false);

            this.messageService.add({
              summary: 'Success',
              detail: 'Quantity has been updated',
              severity: 'success',
            });
          },
          error: (resError: ResponseError) => {
            this._loading.set(false);
            this.messageService.add({
              summary: 'Error',
              detail:
                resError.error.message ||
                'Error occur while updating the book quantity',
              severity: 'error',
            });
          },
        });
    } else {
      this._addOrUpdateItem(book, quantity);

      localStorage.setItem(
        appRouterConfig.localStorage.cart,
        JSON.stringify(this._items()),
      );

      this.messageService.add({
        summary: 'Success',
        detail: `Quantity has been updated`,
        severity: 'success',
      });
      this._addOrUpdateItem(book, quantity);
    }
  }

  removeItem(book: Book) {
    if (this._shoppingSessionId()) {
      this._loading.set(true);

      this.cartItemsApi
        .deleteCartItem(this._shoppingSessionId()!, book.id)
        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this._items.update((prevState) =>
              prevState.filter((item) => item.book.id !== book.id),
            );

            this._loading.set(false);
            this._recalculateTotal();
            this.messageService.add({
              summary: 'Success',
              detail: 'Book has been removed from cart',
              severity: 'success',
            });
          },
          error: (resError: ResponseError) => {
            this._loading.set(false);
            this.messageService.add({
              summary: 'Error',
              detail:
                resError.error.message ||
                'Error occur while removing the book quantity',
              severity: 'error',
            });
          },
        });
    } else {
      this._items.update((prevState) =>
        prevState.filter(({ book: { id } }) => id !== book.id),
      );

      localStorage.setItem(
        appRouterConfig.localStorage.cart,
        JSON.stringify(this._items()),
      );

      this._recalculateTotal();

      this.messageService.add({
        summary: 'Success',
        detail: 'Book has been removed from cart',
        severity: 'success',
      });
    }
  }

  syncLocalstorage() {
    this._shoppingSessionId.set(null);
    localStorage.removeItem(appRouterConfig.localStorage.cart);
    localStorage.setItem(
      appRouterConfig.localStorage.cart,
      JSON.stringify(this._items()),
    );
  }

  syncDatabase() {
    const cartItems = this._items().map((item) => ({
      bookId: item.book.id,
      quantity: item.quantity,
    }));

    if (cartItems.length === 0) {
      this.getCartItems();
      return;
    }

    this.shoppingSessionApi
      .getShoppingSession()
      .pipe(
        switchMap((session) =>
          this.shoppingSessionApi.createManyCartItems(session.id, cartItems),
        ),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (session) => {
          this._shoppingSessionId.set(session.id);

          this._items.set(
            session.cartItems.map(({ book, quantity }) => ({ book, quantity })),
          );

          this._recalculateTotal();

          localStorage.removeItem(appRouterConfig.localStorage.cart);
        },
        error: (resError: ResponseError) => {
          console.error(resError);
        },
      });
  }

  clear() {
    this._items.set([]);
    this._shoppingSessionId.set(null);
    this._total.set(0);
    this._loading.set(false);
    this._addingBooks.set([]);
  }

  private _recalculateTotal() {
    const total = this._items().reduce(
      (acc, item) => acc + item.book.price * item.quantity,
      0,
    );

    this._total.set(total);
  }

  private _addOrUpdateItem(book: Book, quantity: number) {
    const isItemInCart = this._items().some((item) => item.book.id === book.id);

    const items = isItemInCart
      ? this._items().map((item) =>
          item.book.id === book.id ? { ...item, quantity } : { ...item },
        )
      : [...this._items(), { book, quantity }];

    this._items.set(items);
  }
}
