import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User, Session, Tokens } from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

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

  getRefreshToken$(userId: User['id'], refreshToken: Tokens['refreshToken']) {
    const body = {
      userId,
      refreshToken,
    };

    return this.http.post<Tokens>(`${this.apiUrl}/auth/refresh`, body);
  }
}
