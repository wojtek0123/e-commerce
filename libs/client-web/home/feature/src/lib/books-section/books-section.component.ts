import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeStore, HomeState } from '@e-commerce/client-web/home/data-acess';
import { Book, BookTag } from '@e-commerce/client-web/shared/data-access';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import { Store } from '@ngrx/store';
import { cartActions } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-books-section',
  standalone: true,
  imports: [BooksGridComponent, RouterLink],
  templateUrl: './books-section.component.html',
  styleUrl: './books-section.component.scss',
})
export class BooksSectionComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly homeStore = inject(HomeStore);

  public tag = input.required<keyof HomeState>();
  public bookTag = input.required<BookTag>();

  public books = computed(() => this.homeStore[this.tag()].books());
  public loading = computed(() => this.homeStore[this.tag()].loading());
  public error = computed(() => this.homeStore[this.tag()].error());

  ngOnInit(): void {
    this.homeStore.getBooks([this.tag(), this.bookTag()]);
  }

  addToCart(book: Book) {
    this.store.dispatch(cartActions.addBookToCart({ book, quantity: 1 }));
  }
}
