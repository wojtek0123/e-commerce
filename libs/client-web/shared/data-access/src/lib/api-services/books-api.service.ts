import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, BookDetails, BookTag, Category, Paginated } from '../api-models';
import { API_URL } from '@e-commerce/client-web/shared/utils';

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getBooks$(params: {
    titleLike?: string;
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
    const convertedParams = {
      ...params,
      categoryNamesIn: params.categoryNamesIn?.join(',') ?? '',
      tagsIn: params.tagsIn?.join(',') ?? '',
      publisherIds: params.publisherIds?.join(',') ?? '',
      authorNamesIn: params.authorNamesIn?.join(',') ?? ''
    };
    return this.http.get<Paginated<Book>>(`${this.apiUrl}/books`, { params: convertedParams as {[key: string]: string | number | boolean } });
  }

  getBook$(id: Book['id']) {
    return this.http.get<BookDetails>(`${this.apiUrl}/books/${id}`);
  }
}
