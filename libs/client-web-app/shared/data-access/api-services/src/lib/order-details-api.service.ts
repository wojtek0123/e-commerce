import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  UserAddress,
  OrderDetails,
  Book,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';

@Injectable({ providedIn: 'root' })
export class OrderDetailsApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  create(body: {
    userAddressId: UserAddress['id'];
    shippingMethodId: number;
    orderItems?: { bookId: Book['id'] };
  }) {
    return this.http.post<OrderDetails>(`${this.apiUrl}/order-details`, body);
  }

  getMany() {
    return this.http.get<OrderDetails[]>(`${this.apiUrl}/order-details`);
  }

  getUnique(id: OrderDetails['id']) {
    return this.http.get<OrderDetails>(`${this.apiUrl}/order-details/${id}`);
  }
}
