import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  User,
  Session,
  Token,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { tap } from 'rxjs';

@Injectable()
export class AuthService {
  private http = inject(HttpClient);

  login$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<Session>('http://localhost:3000/auth/login', body);
  }

  register$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<Session>('http://localhost:3000/auth/register', body);
  }

  setSession({ tokens, user }: Session) {
    localStorage.setItem('access_token', JSON.stringify(tokens.accessToken));
    localStorage.setItem('refresh_token', JSON.stringify(tokens.refreshToken));
    localStorage.setItem('user', JSON.stringify(user));
  }

  getSession(): Session | null {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = localStorage.getItem('user');

    if (!accessToken || !refreshToken || !user) return null;
    return {
      tokens: {
        accessToken: JSON.parse(accessToken),
        refreshToken: JSON.parse(refreshToken),
      },
      user: JSON.parse(user),
    };
  }

  logout(id: User['id']) {
    return this.http.get<User>(`https://localhost:3000/auth/logout/${id}`).pipe(
      tap(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      })
    );
  }

  getRefreshToken$(id: User['id'], refreshToken: string) {
    const body = {
      id,
      refreshToken,
    };

    return this.http.post<Token>('https://localhost:3000/auth/refresh', body);
  }
}
