import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';

@Injectable({ providedIn: 'root' })
export class ShoppingSessionApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  delete() {
    return this.http.delete<unknown>(`${this.apiUrl}/shopping-sessions`);
  }
}
