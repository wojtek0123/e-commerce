import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';
import {
  Pagination,
  Author,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthorApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll$(params: { nameLike?: string } & Pagination) {
    return this.http
      .get<Author[]>(`${this.apiUrl}/authors`, { params: { ...params } })
      .pipe(shareReplay(1));
  }
}
