import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ShoppingSession } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';

@Injectable({ providedIn: 'root' })
export class ShoppingSessionApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getShoppingSession() {
    return this.http
      .get<ShoppingSession>(`${this.apiUrl}/shopping-sessions`)
      .pipe(shareReplay(1));
  }

  createManyCartItems(
    shoppingSessionId: number,
    cartItems: { bookId: number; quantity: number }[]
  ) {
    return this.http.post<ShoppingSession>(
      `${this.apiUrl}/shopping-sessions/${shoppingSessionId}`,
      { cartItems }
    );
  }
}
