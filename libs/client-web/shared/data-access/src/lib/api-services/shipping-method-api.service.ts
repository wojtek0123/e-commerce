import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ShippingMethod } from '@prisma/client';
import { API_URL } from '@e-commerce/client-web/shared/utils';

@Injectable({ providedIn: 'root' })
export class ShippingMethodApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll$() {
    return this.http.get<ShippingMethod[]>(`${this.apiUrl}/shipping-methods`);
  }
}
