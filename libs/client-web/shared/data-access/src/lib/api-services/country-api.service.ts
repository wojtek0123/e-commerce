import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Country } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll$(params: { nameLike?: string }) {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`, { params });
  }
}
