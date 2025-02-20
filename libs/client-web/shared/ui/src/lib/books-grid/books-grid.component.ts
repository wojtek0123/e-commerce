import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Book } from '@e-commerce/shared/api-models';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookCardSkeletonComponent } from '../book-card-skeleton/book-card-skeleton.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-books-grid',
  imports: [BookCardSkeletonComponent, BookCardComponent, Button],
  templateUrl: './books-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksGridComponent {
  books = input.required<Book[]>();
  loading = input<boolean>(false);
  error = input<string | string[] | null>(null);
  skeletonsCount = input<number>(8);
  pendingBookIds = input<Book['id'][]>([]);
  favouriteBooks = input.required<Book[]>();
  displayOneRow = input<boolean>(false);

  skeletons = computed(() => new Array(this.skeletonsCount()));

  addToCartEvent = output<Book>();
  retryEvent = output<void>();
  addToFavouriteEvent = output<Book>();

  retry() {
    this.retryEvent.emit();
  }

  addToFavourite(book: Book) {
    this.addToFavouriteEvent.emit(book);
  }
}
