import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserAddress } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';

type CreateUserAddressBody = Omit<UserAddress, 'id' | 'country'>;

interface UpdateUserAddressBody {
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  street?: string | null;
  phone?: string | null;
  postcode?: string | null;
  houseNumber?: string | null;
  homeNumber?: string | null;
  countryId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class UserAddressApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  createUserAddress(body: CreateUserAddressBody) {
    return this.http.post<UserAddress>(`${this.apiUrl}/user-addresses`, body);
  }

  getUserAddress() {
    return this.http.get<UserAddress>(`${this.apiUrl}/user-addresses`);
  }

  update(id: UserAddress['id'], body: UpdateUserAddressBody) {
    return this.http.patch<UserAddress>(
      `${this.apiUrl}/user-addresses/${id}`,
      body,
    );
  }
}
