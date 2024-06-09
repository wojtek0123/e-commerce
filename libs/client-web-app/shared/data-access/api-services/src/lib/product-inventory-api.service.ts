import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductInventory } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';

@Injectable()
export class ProductInventoryApiService {
  private http = inject(HttpClient);

  getProductInventory(id: ProductInventory['id']) {
    return this.http
      .get<ProductInventory>(`http://localhost:3000/product-inventories/${id}`)
      .pipe(shareReplay(1));
  }
}
