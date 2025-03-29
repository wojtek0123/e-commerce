import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Book, Inventory } from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

@Injectable({ providedIn: 'root' })
export class InventoryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  get(bookId: Book['id']) {
    return this.http.get<Inventory>(`${this.apiUrl}/inventories/${bookId}`);
  }
}
