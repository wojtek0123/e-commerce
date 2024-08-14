import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/utils';
import { Pagination, Author } from '../api-models';

@Injectable({ providedIn: 'root' })
export class AuthorApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll$(params: { nameLike?: string } & Pagination) {
    return this.http.get<Author[]>(`${this.apiUrl}/authors`, {
      params: { ...params },
    });
  }
}
