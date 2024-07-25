import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BookCardSkeletonComponent,
  BookCardComponent,
} from '@e-commerce/client-web-app/shared/ui/book-card';
import {
  Book,
  BookTag,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { catchError, ignoreElements, shareReplay, switchMap, tap } from 'rxjs';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';
import { AsyncPipe, NgClass, ViewportScroller } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { BooksActiveFiltersComponent } from './components/active-filters.component';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import {
  parseQueryParamToSelectedItems,
  parseQueryParamToNumber,
} from '@e-commerce/client-web-app/browse/utils';

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
    BooksActiveFiltersComponent,
    NgClass,
  ],
  template: `
    <div class="flex flex-column gap-5">
      @if ({ books: books$ | async, booksError: booksError$ | async }; as vm) {
        @if (!vm.books && !vm.books) {
          <div class="grid-auto-fit">
            @for (_ of skeletons; track $index) {
              <lib-book-card-skeleton />
            }
          </div>
        } @else if (!vm.books && vm.booksError) {
          <div class="text-center grid-all-columns mt-8">
            <span class="text-3xl text-error">{{ vm.booksError }}</span>
          </div>
        } @else if (vm.books && !vm.booksError) {
          <div
            class="grid-auto-fit"
            [ngClass]="{
              'animation-pulse pointer-events-none': vm.books.page !== page(),
            }"
          >
            @for (book of vm.books.items; track book.id) {
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
          @if (vm.books.count > 0) {
            <div class="card flex justify-content-center">
              <p-paginator
                (onPageChange)="onPageChange($event)"
                [rows]="size()"
                [totalRecords]="vm.books.total"
                [rowsPerPageOptions]="availableSizes()"
              />
            </div>
          }
        }
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

      .height {
        height: calc(100svh - var(--header-height) - 16rem);
      }
    `,
  ],
})
export class BooksViewComponent implements OnInit {
  private booksApi = inject(BooksApiService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viewport = inject(ViewportScroller);

  @HostBinding('class') class = 'w-full';

  awatingBookIdsToAddToCart = this.cartService.addingBookIds;
  skeletons = new Array(12);

  size = signal(2);
  page = signal(1);
  availableSizes = signal([2, 10, 20, 40]).asReadonly();

  books$ = this.route.queryParams
    .pipe(
      switchMap((queryParams) =>
        this.booksApi.getBooks$({
          size: this.size(),
          page: this.page(),
          authorNamesIn: parseQueryParamToSelectedItems(
            queryParams,
            appRouterConfig.queryParams.authors,
          ),
          categoryNames: parseQueryParamToSelectedItems(
            queryParams,
            appRouterConfig.queryParams.categories,
          ),
          tagsIn: parseQueryParamToSelectedItems(
            queryParams,
            appRouterConfig.queryParams.tags,
          ).map((tag) => tag.toUpperCase()) as BookTag[],
          priceFrom: parseQueryParamToNumber(
            queryParams,
            appRouterConfig.queryParams.minPrice,
          ),
          priceTo: parseQueryParamToNumber(
            queryParams,
            appRouterConfig.queryParams.maxPrice,
          ),
        }),
      ),
    )
    .pipe(
      tap(({ count }) => {
        if (count === 0) this.page.set(1);
      }),
      shareReplay(1),
    );
  booksError$ = this.books$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );

  constructor() {
    effect(async () => {
      await this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.page(), size: this.size() },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      console.log(this.page());
    });
  }

  ngOnInit(): void {
    const page = +this.route.snapshot.queryParams['page'];
    this.page.set(page > 1 ? page : 1);

    const size = +this.route.snapshot.queryParams['size'];
    this.size.set(this.availableSizes().includes(size) ? size : 20);
  }

  addToCart(book: Book) {
    this.cartService.addItem(book, 1);
  }

  onPageChange(event: PaginatorState) {
    this.page.set((event.page || 0) + 1);

    if (event.rows) {
      this.size.set(event.rows);
    }

    this.viewport.scrollToPosition([0, 0]);
  }
}
