import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { CreditCard } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class CreditCardApiService {
  private url = inject(API_URL);
  private http = inject(HttpClient);

  get$() {
    return this.http.get<CreditCard>(`${this.url}/credit-cards`);
  }

  create$(body: {
    number: string;
    securityCode: string;
    expirationDate: string;
  }) {
    return this.http.post<CreditCard>(`${this.url}/credit-cards`, body);
  }

  // update$(id: CreditCard['id'], body: Partial<CreditCard>) {
  //   return this.http.patch<CreditCard>(`${this.url}/credit-cards/${id}`, body);
  // }

  delete$(id: CreditCard['id']) {
    return this.http.delete<CreditCard>(`${this.url}/credit-cards/${id}`);
  }
}
