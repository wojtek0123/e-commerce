import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Book } from '@e-commerce/client-web/shared/data-access';
import {
  BookCardComponent,
  BookCardSkeletonComponent,
} from '@e-commerce/client-web/shared/ui';

@Component({
  selector: 'lib-books-grid',
  standalone: true,
  imports: [BookCardSkeletonComponent, BookCardComponent, NgClass],
  templateUrl: './books-grid.component.html',
  styleUrl: './books-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksGridComponent {
  books = input.required<Book[]>();
  loading = input<boolean>(false);
  error = input<string | string[] | null>(null);
  pendingBookIds = input<Book['id'][]>([]);

  errors = computed(() =>
    typeof this.error() === 'string' ? [this.error()] : this.error(),
  );

  addToCartEvent = output<Book>();
}
