import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { User } from '@e-commerce/shared/api-models';

export interface UpdateUserBody {
  email?: string;
  password?: string;
  newPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  get$(id: User['id']) {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  update$(id: User['id'], body: UpdateUserBody) {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, body);
  }
}
