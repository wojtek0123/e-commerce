import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Paginated, Pagination } from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getCategories$(params: { nameLike?: string; nameIn?: string } & Pagination) {
    return this.http
      .get<Paginated<Category>>(`${this.apiUrl}/categories`, {
        params: { ...params },
      })
      .pipe(map(({ items }) => items));
  }
}
