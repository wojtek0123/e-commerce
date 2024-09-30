import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SearchComponent } from './search/search.component';
import { Store } from '@ngrx/store';
import { Book } from '@e-commerce/client-web/shared/data-access';
import {
  ActiveFilter,
  BooksStore,
} from '@e-commerce/client-web/browse/data-access';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { ActiveFiltersComponent } from '@e-commerce/client-web/browse/ui';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FiltersComponent } from './filters/filters.component';
import { ActivatedRoute, Router } from '@angular/router';
import { cartActions } from '@e-commerce/client-web/cart/data-access';

@Component({
  selector: 'lib-books',
  standalone: true,
  imports: [
    BreadcrumbModule,
    SearchComponent,
    AsyncPipe,
    BooksGridComponent,
    PaginatorModule,
    FiltersComponent,
    ActiveFiltersComponent,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  private readonly booksStore = inject(BooksStore);
  private store = inject(Store);
  private viewport = inject(ViewportScroller);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public breadcrumbs = signal<MenuItem[]>([
    { label: 'home', routerLink: '/' },
    {
      label: 'books',
    },
  ]);

  public books = this.booksStore.books;
  public loading = this.booksStore.loading;
  public error = this.booksStore.error;
  public count = this.booksStore.count;
  public total = this.booksStore.total;
  public page = this.booksStore.page;
  public size = this.booksStore.size;
  public first = computed(() => this.page() - 1 * this.size());
  public sizes = signal([20, 40, 60]);
  public activeFilters = this.booksStore.activeFilters;

  ngOnInit(): void {
    // this.route.queryParams
    //   .pipe(
    //     map((queryParams) => ({
    //       tag: queryParams['tags'],
    //       category: queryParams['categories'],
    //     })),
    //     filter(({ category, tag }) => !!category || !!tag),
    //     takeUntilDestroyed(this.destroyRef),
    //   )
    //   .subscribe(({ category, tag }) => {
    //     this.store.dispatch(browseActions.removeActiveFilters());
    //
    //     if (tag) {
    //       this.store.dispatch(
    //         browseActions.setSelectedItems({
    //           activeFitler: {
    //             id: `tag_${tag?.toUpperCase()}`,
    //             name: tag?.toUpperCase(),
    //           },
    //           selectedItems: [tag?.toUpperCase()],
    //           filter: 'tag',
    //         }),
    //       );
    //     }
    //     if (category) {
    //       const categoryItem = JSON.parse(history.state['category']);
    //       history.replaceState({}, '');
    //
    //       if (!categoryItem) return;
    //
    //       this.store.dispatch(
    //         browseActions.setSelectedItems({
    //           activeFitler: {
    //             id: `category_${categoryItem.id}`,
    //             name: categoryItem.name,
    //           },
    //           selectedItems: [categoryItem],
    //           filter: 'category',
    //         }),
    //       );
    //     }
    //
    //     this.router.navigate([], {
    //       relativeTo: this.route,
    //       queryParams: null,
    //       replaceUrl: true,
    //     });
    //   });
    //
    // this.store.dispatch(browseActions.getBooks());
  }

  public addToCart(book: Book) {
    this.store.dispatch(cartActions.addBookToCart({ book, quantity: 1 }));
  }

  public onPageChange(event: PaginatorState, size: number | null) {
    this.booksStore.setPage((event.page || 0) + 1);

    if (event.rows && size !== event.rows) {
      this.booksStore.setSize(event.rows);
    }

    this.viewport.scrollToPosition([0, 0]);
  }

  public clearFilter(activeFilter: ActiveFilter) {
    this.booksStore.removeActiveFilter(activeFilter.id);
  }

  public clearFilters() {
    this.booksStore.removeActiveFilters();
  }
}
