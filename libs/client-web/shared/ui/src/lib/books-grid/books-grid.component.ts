import { NgClass } from '@angular/common';
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

@Component({
  selector: 'lib-books-grid',
  standalone: true,
  imports: [BookCardSkeletonComponent, BookCardComponent, NgClass],
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

  public skeleconts = computed(() => new Array(this.skeletonsCount()));

  public errors = computed(() =>
    typeof this.error() === 'string' ? [this.error()] : this.error(),
  );

  public addToCartEvent = output<Book>();
}
