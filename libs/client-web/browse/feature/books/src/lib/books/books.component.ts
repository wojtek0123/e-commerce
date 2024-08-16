import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SearchComponent } from '../search/search.component';
import { Store } from '@ngrx/store';
import { Book } from '@e-commerce/client-web/shared/data-access';
import {
  browseActions,
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
import { BooksGridComponent } from '@e-commerce/client-web/browse/ui';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { combineLatest, map } from 'rxjs';
import { FiltersComponent } from '../filters/filters.component';

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
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit {
  private store = inject(Store);
  private viewport = inject(ViewportScroller);

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

  ngOnInit(): void {
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
}
