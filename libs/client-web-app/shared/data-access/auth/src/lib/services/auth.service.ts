import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  User,
  Session,
  Tokens,
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

    return this.http
      .post<Session>('http://localhost:3000/auth/login', body)
      .pipe(tap((session) => this.setSession(session)));
  }

  register$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http
      .post<Session>('http://localhost:3000/auth/register', body)
      .pipe(tap((session) => this.setSession(session)));
  }

  logout$(id: User['id']) {
    const body = {
      id,
    };

    return this.http
      .post<User>(`http://localhost:3000/auth/logout`, body)
      .pipe(tap(() => this.removeSession()));
  }

  getRefreshToken$(id: User['id'], refreshToken: string) {
    const body = {
      id,
      refreshToken,
    };

    return this.http
      .post<Tokens>('http://localhost:3000/auth/refresh', body)
      .pipe(tap((tokens) => this.updateTokens(tokens)));
  }

  setSession({ tokens, user }: Session) {
    localStorage.setItem('access_token', JSON.stringify(tokens.accessToken));
    localStorage.setItem('refresh_token', JSON.stringify(tokens.refreshToken));
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  updateTokens({ accessToken, refreshToken }: Session['tokens']) {
    localStorage.setItem('access_token', JSON.stringify(accessToken));
    localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
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
}
