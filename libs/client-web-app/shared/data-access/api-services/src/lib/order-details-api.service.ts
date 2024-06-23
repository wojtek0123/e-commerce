import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  UserAddress,
  OrderDetails,
  Book,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable({ providedIn: 'root' })
export class OrderDetailsApiService {
  private http = inject(HttpClient);

  create(body: {
    userAddressId: UserAddress['id'];
    shippingMethodId: number;
    orderItems?: { bookId: Book['id'] };
  }) {
    return this.http.post<OrderDetails>(
      'http://localhost:3000/order-details',
      body
    );
  }

  getMany() {
    return this.http.get<OrderDetails[]>('http://localhost:3000/order-details');
  }

  getUnique(id: OrderDetails['id']) {
    return this.http.get<OrderDetails>(
      `http://localhost:3000/order-details/${id}`
    );
  }
}
