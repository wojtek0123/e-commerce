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

  getBooks$(opts: {
    title?: string;
    categoryNames?: Category['name'][];
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
    let body = {};

    // TODO: do poprawy
    if (opts.title?.length) body = { ...body, titleLike: opts.title };
    if (opts.size) body = { ...body, size: opts.size };
    if (opts.page) body = { ...body, page: opts.page };
    if (opts.tagsIn?.length)
      body = { ...body, tagsIn: opts.tagsIn.map((t) => t.toUpperCase()) };
    if (opts.priceFrom) body = { ...body, priceFrom: opts.priceFrom };
    if (opts.priceTo) body = { ...body, priceTo: opts.priceTo };
    if (opts.categoryNames?.length)
      body = { ...body, categoryNamesIn: opts.categoryNames };
    if (opts.authorNamesIn?.length)
      body = { ...body, authorNamesIn: opts.authorNamesIn };

    return this.http
      .post<Paginated<Book>>(`${this.apiUrl}/books`, body)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getBook$(id: Book['id']) {
    return this.http
      .get<Book>(`${this.apiUrl}/books/${id}`)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}
