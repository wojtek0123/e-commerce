import { computed, inject, Injectable } from '@angular/core';
import { FavouriteBooksListStore } from '@e-commerce/client-web/account/data-access';
import { Book } from '@e-commerce/shared/api-models';

@Injectable({ providedIn: 'root' })
export class FavouriteBooksListService {
  #favouriteBooksListStore = inject(FavouriteBooksListStore);

  favouriteBooks = computed(() => this.#favouriteBooksListStore.books());

  addToFavourite(bookId: Book['id']) {
    this.#favouriteBooksListStore.addToFavourite({ bookId });
  }
}
