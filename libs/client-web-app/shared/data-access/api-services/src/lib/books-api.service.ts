import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Book,
  BookTag,
  Category,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { shareReplay } from 'rxjs';

@Injectable()
export class BooksApiService {
  private http = inject(HttpClient);

  getBooks$(opts: {
    title?: string;
    categoryIds?: Category['id'][];
    tagsIn?: BookTag[];
    publishDateFrom?: string;
    publishedDateTo?: string;
    publisherIds?: number[];
    priceFrom?: number;
    priceTo?: number;
    authorName?: string;
    authorIds?: number[];
    size?: number;
  }) {
    let body = {};

    if (opts.title?.length) body = { ...body, titleLike: opts.title };
    if (opts.size) body = { ...body, size: opts.size };
    if (opts.tagsIn?.length) body = { ...body, tagsIn: opts.tagsIn };
    if (opts.categoryIds?.length)
      body = { ...body, categoryIdsIn: opts.categoryIds };

    return this.http.post<Book[]>('http://localhost:3000/books', body);
  }

  getBook$(id: Book['id']) {
    return this.http
      .get<Book>(`http://localhost:3000/books/${id}`)
      .pipe(shareReplay(1));
  }
}
