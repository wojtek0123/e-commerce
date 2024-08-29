import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User, Session, Tokens } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';

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

    return this.http.post<User>(`${this.apiUrl}/auth/logout`, body);
  }

  getRefreshToken$(id: User['id'], refreshToken: string) {
    const body = {
      id,
      refreshToken,
    };

    return this.http.post<Tokens>(`${this.apiUrl}/auth/refresh`, body);
  }
}
