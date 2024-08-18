import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SearchComponent } from './search/search.component';
import { Store } from '@ngrx/store';
import { Book } from '@e-commerce/client-web/shared/data-access';
import {
  ActiveFilter,
  browseActions,
  selectActiveFilters,
  selectBooks,
  selectCount,
  selectError,
  selectLoading,
  selectPage,
  selectPendingBookIds,
  selectSize,
  selectTotal,
} from '@e-commerce/client-web/browse/data-access';
import {
  BookCardComponent,
  BookCardSkeletonComponent,
} from '@e-commerce/client-web/shared/ui';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import {
  ActiveFiltersComponent,
  BooksGridComponent,
} from '@e-commerce/client-web/browse/ui';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { combineLatest, filter, map } from 'rxjs';
import { FiltersComponent } from './filters/filters.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-books',
  standalone: true,
  imports: [
    BreadcrumbModule,
    SearchComponent,
    BookCardSkeletonComponent,
    BookCardComponent,
    AsyncPipe,
    BooksGridComponent,
    PaginatorModule,
    FiltersComponent,
    ActiveFiltersComponent,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit {
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

  public books$ = this.store.select(selectBooks);
  public loading$ = this.store.select(selectLoading);
  public error$ = this.store.select(selectError);
  public count$ = this.store.select(selectCount);
  public total$ = this.store.select(selectTotal);
  public page$ = this.store.select(selectPage);
  public size$ = this.store.select(selectSize);
  public pendingBookIds$ = this.store.select(selectPendingBookIds);
  public first$ = combineLatest([this.page$, this.size$]).pipe(
    map(([page, size]) => page - 1 * size),
  );
  public sizes = signal([20, 40, 60]);
  public activeFilters$ = this.store.select(selectActiveFilters);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((queryParams) => ({
          tag: queryParams['tags'],
          category: queryParams['categories'],
        })),
        filter(({ category, tag }) => !!category || !!tag),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ category, tag }) => {
        this.store.dispatch(browseActions.removeActiveFilters());

        if (tag) {
          this.store.dispatch(
            browseActions.setSelectedItems({
              activeFitler: {
                id: `tag_${tag?.toUpperCase()}`,
                name: tag?.toUpperCase(),
              },
              selectedItems: [tag?.toUpperCase()],
              filter: 'tag',
            }),
          );
        }
        if (category) {
          const categoryItem = JSON.parse(history.state['category']);
          history.replaceState({}, '');

          if (!categoryItem) return;

          this.store.dispatch(
            browseActions.setSelectedItems({
              activeFitler: {
                id: `category_${categoryItem.id}`,
                name: categoryItem.name,
              },
              selectedItems: [categoryItem],
              filter: 'category',
            }),
          );
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: null,
          replaceUrl: true,
        });
      });

    this.store.dispatch(browseActions.getBooks());
  }

  public addToCart(book: Book) {
    this.store.dispatch(browseActions.addBookToCart({ book }));
  }

  public onPageChange(event: PaginatorState, size: number | null) {
    this.store.dispatch(browseActions.setPage({ page: (event.page || 0) + 1 }));

    if (event.rows && size !== event.rows) {
      this.store.dispatch(browseActions.setSize({ size: event.rows }));
    }

    this.viewport.scrollToPosition([0, 0]);
  }

  public clearFilter(activeFilter: ActiveFilter) {
    this.store.dispatch(
      browseActions.removeActiveFilter({ activeFilterId: activeFilter.id }),
    );
  }

  public clearFilters() {
    this.store.dispatch(browseActions.removeActiveFilters());
  }
}
