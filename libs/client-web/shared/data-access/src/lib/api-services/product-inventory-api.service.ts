import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Book, ProductInventory } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';

@Injectable({ providedIn: 'root' })
export class ProductInventoryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getProductInventory(bookId: Book['id']) {
    return this.http.get<ProductInventory>(
      `${this.apiUrl}/product-inventories/${bookId}`,
    );
  }
}
