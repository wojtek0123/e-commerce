import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductInventory } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductInventoryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getProductInventory(id: ProductInventory['id']) {
    return this.http
      .get<ProductInventory>(`${this.apiUrl}/product-inventories/${id}`)
      .pipe(shareReplay(1));
  }
}
