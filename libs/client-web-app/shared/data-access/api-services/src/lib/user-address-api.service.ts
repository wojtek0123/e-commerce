import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserAddress } from '@e-commerce/client-web-app/shared/data-access/api-types';

type CreateUserAddressBody = Omit<UserAddress, 'id'>;

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

  update(id: UserAddress['id'], body: Partial<Omit<UserAddress, 'id'>>) {
    return this.http.patch<UserAddress>(
      `http://localhost:3000/user-addresses/${id}`,
      body
    );
  }
}
