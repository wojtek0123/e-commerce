import { Component, inject, OnInit } from '@angular/core';
import { FavouriteBooksListStore } from '@e-commerce/client-web/account/data-access';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import { CartService } from '@e-commerce/client-web/cart/api';
import { Book } from '@e-commerce/shared/api-models';

@Component({
  selector: 'lib-favourite-books-list',
  imports: [BooksGridComponent],
  templateUrl: './favourite-books-list.component.html',
})
export class FavouriteBooksListComponent implements OnInit {
  #favouriteBooksListStore = inject(FavouriteBooksListStore);
  #cartService = inject(CartService);

  favouriteBooks = this.#favouriteBooksListStore.books;
  loading = this.#favouriteBooksListStore.loading;
  error = this.#favouriteBooksListStore.error;

  ngOnInit(): void {
    this.#favouriteBooksListStore.getFavouriteBooks();
  }

  retry() {
    this.#favouriteBooksListStore.getFavouriteBooks();
  }

  addBookToCart(book: Book) {
    this.#cartService.addBook(book, 1);
  }

  addBookToFavourite({ id }: Book) {
    this.#favouriteBooksListStore.addToFavourite({ bookId: id });
  }
}
