import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EnvironmentInjector,
  HostBinding,
  Injector,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { BooksService } from '@e-commerce/client-web-app/browse/data-access';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import {
  BookCardSkeletonComponent,
  BookCardComponent,
} from '@e-commerce/client-web-app/shared/ui/book-card';
import {
  Book,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { from, skip, switchMap, take, takeUntil, tap } from 'rxjs';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';
import { AsyncPipe } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-books-view',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    RouterLink,
    BookCardComponent,
    BookCardSkeletonComponent,
    AsyncPipe,
    PaginatorModule,
  ],
  template: `
    <div class="flex flex-column gap-5">
      @if (loading()) {
        <div class="grid-auto-fit">
          @for (_ of skeletons; track $index) {
            <lib-book-card-skeleton />
          }
        </div>
      } @else if (!loading() && books()) {
        <div class="grid-auto-fit">
          @for (book of books(); track book.id) {
            <lib-book-card
              [awaitingBookIdsToAddToCart]="awatingBookIdsToAddToCart()"
              [book]="book"
              (onAddToCart)="addToCart($event)"
            />
          } @empty {
            <div class="text-center grid-all-columns mt-8">
              <span class="text-3xl">No books were found!</span>
            </div>
          }
        </div>
        @if (books().length > 0) {
          <div class="card flex justify-content-center">
            <p-paginator
              (onPageChange)="onPageChange($event)"
              [first]="page()"
              [rows]="size()"
              [totalRecords]="total()"
              [rowsPerPageOptions]="[10, 20, 30]"
            />
          </div>
        }
      } @else if (error()) {
        <div class="text-center grid-all-columns mt-8">
          <span class="text-3xl text-error">{{ error() }}</span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .scale-animation {
        transform: scale(1);
        transition: transform 250ms ease-in-out;
      }

      .scale-animation:hover {
        transform: scale(0.95);
      }
    `,
  ],
})
export class BooksViewComponent implements OnInit {
  private booksService = inject(BooksService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  private intector = inject(Injector);

  books = signal<Book[]>([]);
  page = signal(1);
  size = signal(20);
  total = signal(0);
  count = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  awatingBookIdsToAddToCart = this.cartService.addingBookIds;
  skeletons = new Array(12);

  @HostBinding('class') class = 'w-full min-content-height';

  ngOnInit(): void {
    this.booksService.filtersHaveChanged$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() => this.booksService.getBooks$(this.page(), this.size())),
        takeUntil(
          toObservable(this.page, { injector: this.intector }).pipe(skip(1)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ items, total, count }) => {
          this.loading.set(false);
          this.books.set(items);
          this.total.set(total);
          this.count.set(count);
        },
        error: (resError: ResponseError) => {
          this.error.set(resError.error.message);
        },
      });
  }

  addToCart(book: Book) {
    this.cartService.addItem(book, 1);
  }

  onPageChange(event: PaginatorState) {
    // this.size.set(event.rows);
    if (event.page) {
      this.page.set(event.page);
    }

    if (event.rows) {
      this.size.set(event.rows);
    }
  }
}
