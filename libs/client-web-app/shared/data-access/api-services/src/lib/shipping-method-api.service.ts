import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ShippingMethod } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShippingMethodApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getShippingMethods() {
    return this.http
      .get<ShippingMethod[]>(`${this.apiUrl}/shipping-methods`)
      .pipe(shareReplay(1));
  }
}
