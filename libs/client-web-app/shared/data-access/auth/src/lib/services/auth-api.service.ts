import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  User,
  Session,
  Tokens,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  login$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<Session>(`${this.apiUrl}/auth/login`, body);
  }

  register$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<Session>(`${this.apiUrl}/auth/register`, body);
  }

  logout$(id: User['id']) {
    const body = {
      id,
    };

    return this.http.post<User>(`http://localhost:3000/auth/logout`, body);
  }

  getRefreshToken$(id: User['id'], refreshToken: string) {
    const body = {
      id,
      refreshToken,
    };

    return this.http.post<Tokens>(`${this.apiUrl}/auth/refresh`, body);
  }
}
