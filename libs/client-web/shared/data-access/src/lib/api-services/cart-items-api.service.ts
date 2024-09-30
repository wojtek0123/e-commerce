import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Book, CartItem, ShoppingSession } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';

@Injectable({ providedIn: 'root' })
export class CartItemsApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  createCartItem(body: { bookId: Book['id']; quantity: CartItem['quantity'] }) {
    return this.http.post<CartItem>(`${this.apiUrl}/cart-items`, body);
  }

  updateQuantity(
    shoppingSessionId: ShoppingSession['id'],
    bookId: Book['id'],
    body: { quantity: number },
  ) {
    return this.http.patch<CartItem>(
      `${this.apiUrl}/cart-items/${shoppingSessionId}/${bookId}`,
      body,
    );
  }

  deleteCartItem(shoppingSessionId: ShoppingSession['id'], bookId: Book['id']) {
    return this.http.delete<CartItem>(
      `${this.apiUrl}/cart-items/${shoppingSessionId}/${bookId}`,
    );
  }
}
