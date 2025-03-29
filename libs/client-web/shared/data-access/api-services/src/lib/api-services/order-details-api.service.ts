import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  ShoppingSession,
  OrderDetails,
  PaymentMethod,
  OrderDetailsBase,
  Book,
  Paginated,
} from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

export interface CreateOrderAddress {
  city: string;
  street: string;
  houseNumber?: string;
  homeNumber: string;
  postcode: string;
  countryId: string;
}

@Injectable({ providedIn: 'root' })
export class OrderDetailsApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  create(body: {
    shippingMethodId: ShoppingSession['id'];
    orderAddress: CreateOrderAddress;
    paymentMethod: PaymentMethod;
  }) {
    return this.http.post<OrderDetails>(`${this.apiUrl}/order-details`, body);
  }

  getMany(params: { size: number; page: number }) {
    return this.http.get<Paginated<OrderDetailsBase>>(
      `${this.apiUrl}/order-details`,
      { params },
    );
  }

  getUnique(id: OrderDetails['id']) {
    return this.http.get<OrderDetails>(`${this.apiUrl}/order-details/${id}`);
  }

  getOrderByBook(bookId: Book['id']) {
    return this.http.get<OrderDetails>(
      `${this.apiUrl}/order-details/book/${bookId}`,
    );
  }
}
