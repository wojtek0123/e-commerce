import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ShippingMethod } from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable({ providedIn: 'root' })
export class ShippingMethodApiService {
  private http = inject(HttpClient);

  getShippingMethods() {
    return this.http.get<ShippingMethod[]>(
      'http://localhost:3000/shipping-methods'
    );
  }
}
