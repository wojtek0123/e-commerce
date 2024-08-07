import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Book,
  BookTag,
  Category,
  Paginated,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';
import { API_URL } from '@e-commerce/client-web-app/shared/utils/providers';

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getBooks$(params: {
    title?: string;
    categoryNamesIn?: Category['name'][];
    tagsIn?: BookTag[];
    publishDateFrom?: string;
    publishedDateTo?: string;
    publisherIds?: number[];
    priceFrom?: number;
    priceTo?: number;
    authorName?: string;
    authorNamesIn?: string[];
    size?: number;
    page?: number;
  }) {
    return this.http
      .get<Paginated<Book>>(`${this.apiUrl}/books`, { params })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getBook$(id: Book['id']) {
    return this.http
      .get<Book>(`${this.apiUrl}/books/${id}`)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}
