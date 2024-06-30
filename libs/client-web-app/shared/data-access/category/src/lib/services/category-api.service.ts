import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getCategories$() {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
