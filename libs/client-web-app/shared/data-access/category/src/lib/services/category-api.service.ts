import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable()
export class CategoryApiService {
  private http = inject(HttpClient);

  getCategories$() {
    return this.http.get<Category[]>('http://localhost:3000/categories');
  }
}
