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
  #booksStore = inject(BooksStore);
  #cartService = inject(CartService);
  #viewport = inject(ViewportScroller);

  breadcrumbs = signal<MenuItem[]>([
    { label: 'home', routerLink: '/' },
    {
      label: 'books',
    },
  ]);

  books = this.#booksStore.books;
  loading = this.#booksStore.loading;
  error = this.#booksStore.error;
  count = this.#booksStore.count;
  total = this.#booksStore.total;
  page = this.#booksStore.page;
  size = this.#booksStore.size;
  first = computed(() => this.page() - 1 * this.size());
  sizes = signal(sizes);
  activeFilters = this.#booksStore.activeFilters;

  ngOnInit(): void {
    this.#booksStore.restoreQueryParamsFilters();
  }

  addToCart(book: Book) {
    this.#cartService.addBook(book, 1);
  }

  onPageChange(event: PaginatorState, size: number | null) {
    this.#booksStore.setPage((event.page || 0) + 1);

    if (event.rows && size !== event.rows) {
      this.#booksStore.setSize(event.rows);
    }

    this.#viewport.scrollToPosition([0, 0]);
  }

  clearFilter(activeFilter: ActiveFilter) {
    this.#booksStore.removeActiveFilter(activeFilter);
  }

  clearFilters() {
    this.#booksStore.removeActiveFilters();
  }

  refetchBooks() {
    this.#booksStore.getBooks();
  }
}
