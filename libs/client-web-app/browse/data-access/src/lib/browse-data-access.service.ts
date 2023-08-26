import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BrowseDataAccessService {
  private http = inject(HttpClient);

  createProduct(name: string, description: string, price: number) {
    const body = {
      name,
      description,
      price,
    };

    return this.http.post('http://localhost:3000/products', body);
  }
}
