import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Book,
  CartItem,
  ShoppingSession,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartItemsApiService {
  private http = inject(HttpClient);

  getUserCartItems() {
    return this.http
      .get<CartItem[]>('http://localhost:3000/cart-items/user-cart-items')
      .pipe(shareReplay(1));
  }

  getUserCartItemsTotal() {
    return this.http.get<number>(
      'http://localhost:3000/cart-items/user-cart-items-total'
    );
  }

  createCartItem(body: {
    bookId: Book['id'];
    quantity: CartItem['quantity'];
    shoppingSessionId: ShoppingSession['id'];
  }) {
    return this.http.post<CartItem>('http://localhost:3000/cart-items', body);
  }

  updateQuantity(id: CartItem['id'], body: { quantity: number }) {
    return this.http.patch<CartItem>(
      `http://localhost:3000/cart-items/${id}`,
      body
    );
  }

  deleteCartItem(id: CartItem['id']) {
    return this.http.delete<CartItem>(`http://localhost:3000/cart-items/${id}`);
  }
}
