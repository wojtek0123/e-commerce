import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  get<T>(url: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${url}`, {
      headers: this.headers,
      params,
    });
  }

  post<T, D>(url: string, data?: D): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, JSON.stringify(data), {
      headers: this.headers,
    });
  }

  put<T, D>(url: string, data: D): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${url}`, JSON.stringify(data), {
      headers: this.headers,
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${url}`, {
      headers: this.headers,
    });
  }

  get headers(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    return new HttpHeaders(headersConfig);
  }
}
