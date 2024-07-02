import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { BooksService } from '@e-commerce/client-web-app/browse/data-access';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import {
  BookCardSkeletonComponent,
  BookCardComponent,
} from '@e-commerce/client-web-app/shared/ui/book-card';
import {
  Book,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { switchMap, tap } from 'rxjs';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';
import { AsyncPipe } from '@angular/common';

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
  ],
  template: `
    <div class="grid-auto-fit">
      @if (loading()) { @for (_ of skeletons; track $index) {
      <lib-book-card-skeleton />
      } } @else if (!loading() && books()) { @for (book of books(); track
      book.id) {
      <lib-book-card
        [awaitingBookIdsToAddToCart]="awatingBookIdsToAddToCart()"
        [book]="book"
        (onAddToCart)="addToCart($event)"
      />
      } @empty {
      <div class="text-center grid-all-columns mt-8">
        <span class="text-3xl">No books were found!</span>
      </div>
      }} @else if (error()) {
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
  private route = inject(ActivatedRoute);

  books = signal<Book[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  awatingBookIdsToAddToCart = this.cartService.addingBookIds;
  skeletons = new Array(12);

  @HostBinding('class') class = 'w-full min-content-height';

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((queryParams) =>
          this.booksService.getBooks$({
            tags: queryParams[appRouterConfig.browse.tagsQueryParams],
            search: queryParams[appRouterConfig.browse.searchQueryParams],
            categoryNames:
              queryParams[appRouterConfig.browse.categoriesQueryParams],
          })
        )
      )
      .subscribe({
        next: (books) => {
          this.loading.set(false);
          this.books.set(books);
        },
        error: (resError: ResponseError) => {
          this.error.set(resError.error.message);
        },
      });
  }

  addToCart(book: Book) {
    this.cartService.addItem(book, 1);
  }
}
