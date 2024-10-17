import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ShoppingSession } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';
import { OrderDetails } from '../api-models/order-details.model';
import { PaymentMethod } from '../api-models/payment-method.model';

export interface CreateOrderAddress {
  firstName: string;
  lastName: string;
  phone: string;
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

  getMany() {
    return this.http.get<OrderDetails[]>(`${this.apiUrl}/order-details`);
  }

  getUnique(id: OrderDetails['id']) {
    return this.http.get<OrderDetails>(`${this.apiUrl}/order-details/${id}`);
  }
}
