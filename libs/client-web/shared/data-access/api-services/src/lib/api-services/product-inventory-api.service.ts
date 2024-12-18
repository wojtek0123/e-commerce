import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Book, ProductInventory } from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

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
