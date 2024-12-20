import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SearchComponent } from './components/search/search.component';
import { Book } from '@e-commerce/shared/api-models';
import {
  ActiveFilter,
  BooksStore,
  sizes,
} from '@e-commerce/client-web/browse/data-access';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import { ViewportScroller } from '@angular/common';
import { ActiveFiltersComponent } from '@e-commerce/client-web/browse/ui';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FiltersComponent } from './components/filters/filters.component';
import { CartService } from '@e-commerce/client-web/cart/api';

@Component({
  selector: 'lib-books',
  standalone: true,
  imports: [
    BreadcrumbModule,
    SearchComponent,
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
  private readonly cartService = inject(CartService);
  private viewport = inject(ViewportScroller);

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
  public sizes = signal(sizes);
  public activeFilters = this.booksStore.activeFilters;

  public ngOnInit(): void {
    this.booksStore.restoreQueryParamsFilters();
  }

  public addToCart(book: Book) {
    this.cartService.addBook(book, 1);
  }

  public onPageChange(event: PaginatorState, size: number | null) {
    this.booksStore.setPage((event.page || 0) + 1);

    if (event.rows && size !== event.rows) {
      this.booksStore.setSize(event.rows);
    }

    this.viewport.scrollToPosition([0, 0]);
  }

  public clearFilter(activeFilter: ActiveFilter) {
    this.booksStore.removeActiveFilter(activeFilter);
  }

  public clearFilters() {
    this.booksStore.removeActiveFilters();
  }
}
