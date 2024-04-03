import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '@e-commerce/client-web-app/shared/api-types';

@Injectable()
export class HomeService {
  private http = inject(HttpClient);

  getCategories$() {
    return this.http.get<{ categories: Category[] }>(
      'http://localhost:3000/categories'
    );
  }
}
