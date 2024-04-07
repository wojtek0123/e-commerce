import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class AuthService {
  private http = inject(HttpClient);

  login$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<{ accessToken: string }>(
      'http://localhost:3000/auth/login',
      body
    );
  }

  register$(email: string | null, password: string | null) {
    const body = {
      email,
      password,
    };

    return this.http.post<{ accessToken: string }>(
      'http://localhost:3000/auth/register',
      body
    );
  }
}
