import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
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
import { catchError, ignoreElements, shareReplay, switchMap } from 'rxjs';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';
import { AsyncPipe } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ActiveFiltersComponent } from './components/active-filters.component';
import { BooksApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

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
    ActiveFiltersComponent,
  ],
  template: `
    <lib-active-filters />
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
          <div class="grid-auto-fit">
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
                [first]="vm.books.page"
                [rows]="size()"
                [totalRecords]="vm.books.count"
                [rowsPerPageOptions]="[10, 20, 30]"
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
    `,
  ],
})
export class BooksViewComponent {
  private booksApi = inject(BooksApiService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  awatingBookIdsToAddToCart = this.cartService.addingBookIds;
  skeletons = new Array(12);

  size = signal(20);

  books$ = this.route.queryParams
    .pipe(
      switchMap((queryParams) =>
        this.booksApi.getBooks$({
          size: this.size(),
          page: queryParams['page'] ?? 1,
          authorNamesIn: (
            queryParams[appRouterConfig.queryParams.authors] as
              | string
              | undefined
          )
            ?.replaceAll('_', ' ')
            .split(','),
          categoryNames: (
            queryParams[appRouterConfig.queryParams.categories] as
              | string
              | undefined
          )
            ?.replaceAll('_', ' ')
            .split(','),
          tagsIn: (
            queryParams[appRouterConfig.queryParams.tags] as string | undefined
          )
            ?.replaceAll('_', ' ')
            .toUpperCase()
            .split(',') as BookTag[],
          priceFrom:
            +queryParams[appRouterConfig.queryParams.minPrice] || undefined,
          priceTo:
            +queryParams[appRouterConfig.queryParams.maxPrice] || undefined,
        }),
      ),
    )
    .pipe(shareReplay(1));
  booksError$ = this.books$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );

  @HostBinding('class') class =
    'w-full min-content-height flex flex-column gap-3';

  addToCart(book: Book) {
    this.cartService.addItem(book, 1);
  }

  onPageChange(event: PaginatorState) {
    if (event.page) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: event.page },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }

    // if (event.rows) {
    //   this.size.set(event.rows);
    // }
  }
}
