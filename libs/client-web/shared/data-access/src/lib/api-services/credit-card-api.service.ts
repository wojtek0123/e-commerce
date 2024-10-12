import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/utils';
import { CreditCard } from '@prisma/client';
import { Pick } from '@prisma/client/runtime/library';

export type CreditCardBase = Omit<
  CreditCard,
  'securityCode' | 'expirationDate'
>;

@Injectable({ providedIn: 'root' })
export class CreditCardApiService {
  private url = inject(API_URL);
  private http = inject(HttpClient);

  get$() {
    return this.http.get<CreditCardBase>(`${this.url}/credit-cards`);
  }

  create$(
    body: Pick<CreditCard, 'number' | 'expirationDate' | 'securityCode'>,
  ) {
    return this.http.post<CreditCardBase>(`${this.url}/credit-cards`, body);
  }

  // update$(id: CreditCard['id'], body: Partial<CreditCard>) {
  //   return this.http.patch<CreditCard>(`${this.url}/credit-cards/${id}`, body);
  // }

  delete$(id: CreditCardBase['id']) {
    return this.http.delete<CreditCardBase>(`${this.url}/credit-cards/${id}`);
  }
}
