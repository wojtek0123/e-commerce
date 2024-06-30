import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Book,
  CartItem,
  ShoppingSession,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable({ providedIn: 'root' })
export class CartItemsApiService {
  private http = inject(HttpClient);

  createCartItem(body: {
    shoppingSessionId: ShoppingSession['id'];
    bookId: Book['id'];
    quantity: CartItem['quantity'];
  }) {
    return this.http.post<CartItem>('http://localhost:3000/cart-items', body);
  }

  updateQuantity(
    shoppingSessionId: number,
    bookId: Book['id'],
    body: { quantity: number }
  ) {
    return this.http.patch<CartItem>(
      `http://localhost:3000/cart-items/${shoppingSessionId}/${bookId}`,
      body
    );
  }

  deleteCartItem(shoppingSessionId: ShoppingSession['id'], bookId: Book['id']) {
    return this.http.delete<CartItem>(
      `http://localhost:3000/cart-items/${shoppingSessionId}/${bookId}`
    );
  }
}
