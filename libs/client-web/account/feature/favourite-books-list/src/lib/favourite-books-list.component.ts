import { Component, inject } from '@angular/core';
import { FavouriteBooksListStore } from '@e-commerce/client-web/account/data-access';
import {
  BooksGridComponent,
  ErrorAndRetryMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { Skeleton } from 'primeng/skeleton';
import { CartService } from '@e-commerce/client-web/cart/api';
import { Book } from '@e-commerce/shared/api-models';

@Component({
  selector: 'lib-favourite-books-list',
  imports: [ErrorAndRetryMessageComponent, Skeleton, BooksGridComponent],
  templateUrl: './favourite-books-list.component.html',
})
export class FavouriteBooksListComponent {
  #store = inject(FavouriteBooksListStore);
  #cartService = inject(CartService);

  favouriteBooks = this.#store.books;
  loading = this.#store.loading;
  error = this.#store.error;

  retry() {
    this.#store.getFavouriteBooks();
  }

  addToCart(book: Book) {
    this.#cartService.addBook(book, 1);
  }

  addToFavourite({ id }: Book) {
    this.#store.addToFavourite({ bookId: id });
  }
}
