import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { Book, BookReview } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class BookReviewApiService {
  #http = inject(HttpClient);
  #apiUrl = inject(API_URL);

  create(body: {
    bookId: Book['id'];
    rating: number;
    name: string;
    message: string;
  }) {
    return this.#http.post<BookReview>(`${this.#apiUrl}/book-reviews`, body);
  }

  update(id: BookReview['id'], body: { rating: number; message: string }) {
    return this.#http.patch(`${this.#apiUrl}/book-reviews/${id}`, body);
  }
}
