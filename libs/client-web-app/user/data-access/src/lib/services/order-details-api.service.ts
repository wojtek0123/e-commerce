import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';
import { OrderDetails } from '../models/order-details.model';

@Injectable()
export class OrderDetailsApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getOrders() {
    return this.http.get<OrderDetails[]>(`${this.apiUrl}/order-details`);
  }

  getOrder(id: number) {
    return this.http.get<OrderDetails>(`${this.apiUrl}/order-details/${id}`);
  }
}
