import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Country } from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll$(params: { nameLike?: string }) {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`, { params });
  }
}
