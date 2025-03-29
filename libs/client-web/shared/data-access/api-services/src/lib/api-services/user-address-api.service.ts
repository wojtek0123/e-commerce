import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Country, UserAddress } from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

export type CreateUserAddressBody = Omit<UserAddress, 'id' | 'country'>;

interface UpdateUserAddressBody {
  city?: string | null;
  street?: string | null;
  postcode?: string | null;
  houseNumber?: string | null;
  homeNumber?: string | null;
  countryId?: Country['id'] | null;
}

@Injectable({ providedIn: 'root' })
export class UserAddressApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll$() {
    return this.http.get<UserAddress[]>(`${this.apiUrl}/user-addresses`);
  }

  create$(body: CreateUserAddressBody) {
    return this.http.post<UserAddress>(`${this.apiUrl}/user-addresses`, body);
  }

  getOne$(id: UserAddress['id']) {
    return this.http.get<UserAddress>(`${this.apiUrl}/user-addresses/${id}`);
  }

  update$(id: UserAddress['id'], body: UpdateUserAddressBody) {
    return this.http.patch<UserAddress>(
      `${this.apiUrl}/user-addresses/${id}`,
      body,
    );
  }

  delete$(id: UserAddress['id']) {
    return this.http.delete<UserAddress>(`${this.apiUrl}/user-addresses/${id}`);
  }
}
