import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';
import {
  CreditCard,
  CreditCardBase,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable({ providedIn: 'root' })
export class CreditCardApiService {
  private url = inject(API_URL);
  private http = inject(HttpClient);

  get() {
    return this.http.get<CreditCardBase>(`${this.url}/credit-cards`);
  }

  create(body: {
    number: string;
    expirationDate: string;
    securityCode: string;
  }) {
    return this.http.post<CreditCardBase>(`${this.url}/credit-cards`, body);
  }

  update(id: CreditCardBase['id'], body: CreditCard) {
    return this.http.patch<CreditCardBase>(
      `${this.url}/credit-cards/${id}`,
      body,
    );
  }

  delete(id: CreditCardBase['id']) {
    return this.http.delete<CreditCardBase>(`${this.url}/credit-cards/${id}`);
  }
}
