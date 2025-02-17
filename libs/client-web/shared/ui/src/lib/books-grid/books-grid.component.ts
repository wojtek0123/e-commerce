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
  standalone: true,
  imports: [BookCardSkeletonComponent, BookCardComponent, Button],
  templateUrl: './books-grid.component.html',
  styleUrl: './books-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksGridComponent {
  public books = input.required<Book[]>();
  public loading = input<boolean>(false);
  public error = input<string | string[] | null>(null);
  public skeletonsCount = input<number>(8);
  public pendingBookIds = input<Book['id'][]>([]);
  public favouriteBooks = input.required<Book[]>();
  displayOneRow = input<boolean>(false);

  public skeletons = computed(() => new Array(this.skeletonsCount()));

  public addToCartEvent = output<Book>();
  onRetry = output<void>();
  onAddToFavourite = output<Book>();

  retry() {
    this.onRetry.emit();
  }

  addToFavourite(book: Book) {
    this.onAddToFavourite.emit(book);
  }
}
