import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Category,
  Pagination,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getCategories$(params: { nameLike?: string } & Pagination) {
    return this.http
      .get<Category[]>(`${this.apiUrl}/categories`, {
        params: { ...params },
      })
      .pipe(shareReplay(1));
  }
}
