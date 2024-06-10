import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserAddress } from '@e-commerce/client-web-app/shared/data-access/api-types';

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

  createUserAddress(body: CreateUserAddressBody) {
    return this.http.post<UserAddress>(
      'http://localhost:3000/user-addresses',
      body
    );
  }

  getUserAddress() {
    return this.http.get<UserAddress>('http://localhost:3000/user-addresses');
  }

  update(id: UserAddress['id'], body: UpdateUserAddressBody) {
    return this.http.patch<UserAddress>(
      `http://localhost:3000/user-addresses/${id}`,
      body
    );
  }
}
