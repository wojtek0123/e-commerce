import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SearchComponent } from './search/search.component';
import { Book } from '@e-commerce/client-web/shared/data-access/api-models';
import {
  ActiveFilter,
  BooksStore,
} from '@e-commerce/client-web/browse/data-access';
import { BooksGridComponent } from '@e-commerce/client-web/shared/ui';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { ActiveFiltersComponent } from '@e-commerce/client-web/browse/ui';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FiltersComponent } from './filters/filters.component';
import { CartService } from '@e-commerce/client-web/cart/api';

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
export class BooksComponent {
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
  public sizes = signal([20, 40, 60]);
  public activeFilters = this.booksStore.activeFilters;

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
    this.booksStore.removeActiveFilter(activeFilter.id);
  }

  public clearFilters() {
    this.booksStore.removeActiveFilters();
  }
}
