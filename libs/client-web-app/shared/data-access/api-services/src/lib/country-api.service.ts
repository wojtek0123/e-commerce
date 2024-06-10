import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Country } from '@e-commerce/client-web-app/shared/data-access/api-types';

@Injectable()
export class CountryApiService {
  private http = inject(HttpClient);

  getCountries() {
    return this.http.get<Country[]>('http://localhost:3000/countries');
  }
}
