import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { Book, ShoppingSession } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class ShoppingSessionApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getShoppingSession() {
    return this.http.get<ShoppingSession>(`${this.apiUrl}/shopping-sessions`);
  }

  createManyCartItems(
    shoppingSessionId: ShoppingSession['id'],
    cartItems: { bookId: Book['id']; quantity: number }[],
  ) {
    return this.http.post<ShoppingSession>(
      `${this.apiUrl}/shopping-sessions/${shoppingSessionId}`,
      { cartItems },
    );
  }

  delete() {
    return this.http.delete<unknown>(`${this.apiUrl}/shopping-sessions`);
  }
}
