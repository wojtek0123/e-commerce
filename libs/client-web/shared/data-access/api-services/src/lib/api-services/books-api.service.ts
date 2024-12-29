import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Author,
  Book,
  BookDetails,
  BookTag,
  Category,
  Paginated,
} from '@e-commerce/shared/api-models';
import { API_URL } from '@e-commerce/client-web/shared/app-config';

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getBooks$(params: {
    titleLike?: string;
    categoryIdIn?: Category['id'][];
    tagIn?: BookTag[];
    publishDateFrom?: string;
    publishedDateTo?: string;
    publisherIds?: string[];
    priceFrom?: number;
    priceTo?: number;
    authorName?: string;
    authorIdIn?: Author['id'][];
    size?: number;
    page?: number;
    sortBy?: string;
    sortByMode?: 'asc' | 'desc';
  }) {
    const convertedParams = {
      ...params,
      categoryIdIn: params.categoryIdIn?.join(',') ?? '',
      tagIn: params.tagIn?.join(',') ?? '',
      publisherIds: params.publisherIds?.join(',') ?? '',
      authorIdIn: params.authorIdIn?.join(',') ?? '',
    };

    return this.http.get<Paginated<Book>>(`${this.apiUrl}/books`, {
      params: convertedParams as { [key: string]: string | number | boolean },
    });
  }

  getBook$(id: Book['id']) {
    return this.http.get<BookDetails>(`${this.apiUrl}/books/${id}`);
  }
}
