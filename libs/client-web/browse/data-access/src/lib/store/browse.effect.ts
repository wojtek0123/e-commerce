import { inject, Injectable } from '@angular/core';
import {
  allBookTags,
  AuthorApiService,
  BooksApiService,
  CartItemsApiService,
  CategoryApiService,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { browseActions } from './browse.action';
import { debounce, filter, map, of, switchMap, timer } from 'rxjs';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import {
  selectFilters,
  selectPage,
  selectSearch,
  selectSize,
} from './browse.selector';

@Injectable()
export class BrowseEffect {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private bookApi = inject(BooksApiService);
  private cartItemApi = inject(CartItemsApiService);
  private authorApi = inject(AuthorApiService);
  private categoryApi = inject(CategoryApiService);

  getBooks = createEffect(() =>
    this.actions$.pipe(
      ofType(
        browseActions.getBooks,
        browseActions.setSearch,
        browseActions.setPage,
        browseActions.setSize,
        browseActions.setSelectedItems,
        browseActions.setPrice,
        browseActions.removeActiveFilter,
        browseActions.removeActiveFilters,
        browseActions.clearFilterSelectedItems,
      ),
      concatLatestFrom(() => [
        this.store.select(selectSearch),
        this.store.select(selectPage),
        this.store.select(selectSize),
        this.store.select(selectFilters),
      ]),
      debounce(([action]) =>
        action.type === browseActions.setSearch.type ? timer(350) : of({}),
      ),
      switchMap(([, search, page, size, filters]) =>
        this.bookApi
          .getBooks$({
            ...(search && { titleLike: search }),
            ...(filters.price.min && { priceFrom: filters.price.min }),
            ...(filters.price.max && { priceTo: filters.price.max }),
            authorNamesIn: filters.author.selectedItems.map(({ name }) => name),
            categoryNamesIn: filters.category.selectedItems.map(
              ({ name }) => name,
            ),
            tagsIn: filters.tag.selectedItems,
            page,
            size,
          })
          .pipe(
            mapResponse({
              next: ({ items, count, total }) => {
                return browseActions.getBooksSuccess({
                  books: items,
                  count,
                  total,
                });
              },
              error: (error: ResponseError) => {
                return browseActions.getBooksFailure({ error });
              },
            }),
          ),
      ),
    ),
  );

  addBookToCart = createEffect(() =>
    this.actions$.pipe(
      ofType(browseActions.addBookToCart),
      switchMap(({ book }) =>
        this.cartItemApi
          .createCartItem({
            bookId: book.id,
            quantity: 1,
          })
          .pipe(
            mapResponse({
              next: ({ bookId }) => {
                return browseActions.addBookToCartSuccess({ bookId });
              },
              error: (error: ResponseError) => {
                return browseActions.addBookToCartFailure({
                  error,
                  bookId: book.id,
                });
              },
            }),
          ),
      ),
    ),
  );

  getAuthorFilter = createEffect(() =>
    this.actions$.pipe(
      ofType(browseActions.getFilter),
      filter(({ filter }) => filter === 'author'),
      switchMap(({ name, filter }) =>
        this.authorApi
          .getAll$({ page: 1, size: 20, ...(name && { nameLike: name }) })
          .pipe(
            mapResponse({
              next: (authors) => {
                return browseActions.getFilterSuccess({
                  items: authors,
                  filter,
                });
              },
              error: (error: ResponseError) => {
                return browseActions.getFilterFailure({ error });
              },
            }),
          ),
      ),
    ),
  );

  getCategoryFilter = createEffect(() =>
    this.actions$.pipe(
      ofType(browseActions.getFilter),
      filter(({ filter }) => filter === 'category'),
      switchMap(({ name, filter }) =>
        this.categoryApi
          .getCategories$({
            page: 1,
            size: 20,
            ...(name && { nameLike: name }),
          })
          .pipe(
            mapResponse({
              next: (items) => {
                return browseActions.getFilterSuccess({ items, filter });
              },
              error: (error: ResponseError) => {
                return browseActions.getFilterFailure({ error });
              },
            }),
          ),
      ),
    ),
  );

  getTagFilter = createEffect(() =>
    this.actions$.pipe(
      ofType(browseActions.getFilter),
      filter(({ filter }) => filter === 'tag'),
      map(({ name, filter }) => {
        const tags = allBookTags.filter((tag) =>
          tag.toLowerCase().includes(name?.toLowerCase() ?? ''),
        );

        return browseActions.getFilterSuccess({ items: tags, filter });
      }),
    ),
  );
}