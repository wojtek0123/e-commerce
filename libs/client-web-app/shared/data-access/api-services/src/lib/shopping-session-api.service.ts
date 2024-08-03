import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';
import { ShoppingSession } from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable({ providedIn: 'root' })
export class ShoppingSessionApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getShoppingSession() {
    return this.http.get<ShoppingSession>(`${this.apiUrl}/shopping-sessions`);
  }

  createManyCartItems(
    shoppingSessionId: number,
    cartItems: { bookId: number; quantity: number }[],
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
