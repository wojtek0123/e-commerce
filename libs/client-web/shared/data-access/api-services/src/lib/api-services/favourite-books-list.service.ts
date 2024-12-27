import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '@e-commerce/client-web/shared/app-config';
import { Book, FavouriteBooksList } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class FavouriteBooksListApiService {
  #http = inject(HttpClient);
  #apiUrl = inject(API_URL);

  get() {
    return this.#http.get<FavouriteBooksList>(
      `${this.#apiUrl}/favourite-books-lists`,
    );
  }

  update(body: { bookId: Book['id'] }) {
    return this.#http.patch<FavouriteBooksList>(
      `${this.#apiUrl}/favourite-books-lists`,
      body,
    );
  }
}
