import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SearchComponent } from '@e-commerce/client-web/browse/ui';
import { Book } from '@e-commerce/shared/api-models';
import {
  ActiveFilter,
  BooksSort,
  BooksStore,
  sizes,
} from '@e-commerce/client-web/browse/data-access';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import { ViewportScroller } from '@angular/common';
import { ActiveFiltersComponent } from '@e-commerce/client-web/browse/ui';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FiltersComponent } from './components/filters/filters.component';
import { CartService } from '@e-commerce/client-web/cart/api';
import { FavouriteBooksListService } from '@e-commerce/client-web/account/api';
import { SortComponent } from '@e-commerce/client-web/browse/ui';
import { SaveFiltersComponent } from './components/save-filters/save-filters.component';
import { LoadFiltersComponent } from './components/load-filters/load-filters.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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
    SortComponent,
    SaveFiltersComponent,
    LoadFiltersComponent,
    ButtonModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DynamicDialogRef],
})
export class BooksComponent implements OnInit {
  #booksStore = inject(BooksStore);
  #cartService = inject(CartService);
  #favouriteBooksListService = inject(FavouriteBooksListService);
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
  sort = this.#booksStore.sort;
  search = this.#booksStore.search;
  count = this.#booksStore.count;
  total = this.#booksStore.total;
  page = this.#booksStore.page;
  size = this.#booksStore.size;
  sortOptions = signal<BooksSort[]>([
    { key: 'title', direction: 'asc' },
    { key: 'title', direction: 'desc' },
    { key: 'price', direction: 'asc' },
    { key: 'price', direction: 'desc' },
    { key: 'publishedDate', direction: 'asc' },
    { key: 'publishedDate', direction: 'desc' },
  ]);
  first = computed(() => this.page() - 1 * this.size());
  sizes = signal(sizes);
  activeFilters = this.#booksStore.activeFilters;
  favouriteBooks = this.#favouriteBooksListService.favouriteBooks;

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

  retry() {
    this.#booksStore.getBooks();
  }

  addToFavourite({ id }: Book) {
    this.#favouriteBooksListService.addToFavourite(id);
  }

  changeSort(booksSort: BooksSort) {
    this.#booksStore.setSort(booksSort);
  }

  changeSearch(search: string | null) {
    this.#booksStore.setSingleValueFilter(search, 'search');
  }
}
