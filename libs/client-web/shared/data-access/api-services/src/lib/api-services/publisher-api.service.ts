import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { Pagination, Author } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class PublisherApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  public getAll$(params: { nameLike?: string; nameIn?: string } & Pagination) {
    return this.http.get<Author[]>(`${this.apiUrl}/publishers`, {
      params: { ...params },
    });
  }
}
