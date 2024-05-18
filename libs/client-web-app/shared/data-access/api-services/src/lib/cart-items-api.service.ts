import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Book,
  CartItem,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';
import { AuthStore } from '@e-commerce/client-web-app/shared/data-access/auth';

@Injectable()
export class CartItemsApiService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);

  getUserCartItems() {
    return this.http
      .get<CartItem[]>('http://localhost:3000/cart-items/user-cart-items')
      .pipe(shareReplay(1));
  }

  createCartItem({
    bookId,
    quantity,
  }: {
    bookId: Book['id'];
    quantity: number;
  }) {
    const body = {
      quantity,
      bookId,
      userId: this.authStore.userId(),
    };

    return this.http.post<CartItem>('http://localhost:3000/cart-items', body);
  }

  updateQuantity(id: CartItem['id'], { quantity }: { quantity: number }) {
    const body = {
      quantity,
    };

    return this.http.patch<CartItem>(
      `http://localhost:3000/cart-items/${id}`,
      body
    );
  }

  deleteCartItem(id: CartItem['id']) {
    return this.http.delete<CartItem>(`http://localhost:3000/cart-items/${id}`);
  }
}
