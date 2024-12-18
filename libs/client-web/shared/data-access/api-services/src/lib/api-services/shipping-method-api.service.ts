import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ShippingMethod } from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

@Injectable({ providedIn: 'root' })
export class ShippingMethodApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll$() {
    return this.http.get<ShippingMethod[]>(`${this.apiUrl}/shipping-methods`);
  }
}
