import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  User,
  Session,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable()
export class AuthService {
  private http = inject(HttpClient);

  login$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<{ accessToken: string; user: User }>(
      'http://localhost:3000/auth/login',
      body
    );
  }

  register$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<{ accessToken: string; user: User }>(
      'http://localhost:3000/auth/register',
      body
    );
  }

  setSession({ accessToken, user }: Session) {
    localStorage.setItem('access_token', JSON.stringify(accessToken));
    localStorage.setItem('user', JSON.stringify(user));
  }

  getSession(): Session | null {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (!token || !user) return null;
    return { accessToken: JSON.parse(token), user: JSON.parse(user) };
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}
