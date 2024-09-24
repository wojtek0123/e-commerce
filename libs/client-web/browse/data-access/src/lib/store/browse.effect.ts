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
import {
  debounce,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  timer,
} from 'rxjs';
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

  triggerGetBooks = createEffect(() =>
    this.actions$.pipe(
      ofType(
        browseActions.removeActiveFilters,
        browseActions.setSearch,
        browseActions.setPrice,
      ),
      concatLatestFrom(() => [
        this.store.select(selectSearch),
        this.store.select(selectFilters),
      ]),
      debounce(([action]) =>
        action.type === browseActions.setSearch.type ? timer(350) : of({}),
      ),
      distinctUntilChanged((prev, curr) => {
        const [, prevSearch, prevFilters] = prev;
        const [, currSearch, currFilters] = curr;

        const isEqual = (a: any, b: any) =>
          JSON.stringify(a) === JSON.stringify(b);

        return (
          prevSearch === currSearch &&
          isEqual(
            prevFilters.tag.selectedItems,
            currFilters.tag.selectedItems,
          ) &&
          isEqual(prevFilters.price, currFilters.price) &&
          isEqual(
            prevFilters.author.selectedItems,
            currFilters.author.selectedItems,
          ) &&
          isEqual(
            prevFilters.category.selectedItems,
            currFilters.category.selectedItems,
          )
        );
      }),
      map(() => browseActions.getBooks()),
    ),
  );

  getBooks = createEffect(() =>
    this.actions$.pipe(
      ofType(
        browseActions.getBooks,
        browseActions.setPage,
        browseActions.setSize,
        browseActions.setSelectedItems,
        browseActions.removeActiveFilter,
        browseActions.clearFilterSelectedItems,
      ),
      concatLatestFrom(() => [
        this.store.select(selectSearch),
        this.store.select(selectPage),
        this.store.select(selectSize),
        this.store.select(selectFilters),
      ]),
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

  // getAuthorFilter = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(browseActions.getFilter),
  //     filter(({ filter }) => filter === 'author'),
  //     switchMap(({ name, filter }) =>
  //       this.authorApi
  //         .getAll$({ page: 1, size: 20, ...(name && { nameLike: name }) })
  //         .pipe(
  //           mapResponse({
  //             next: (authors) => {
  //               return browseActions.getFilterSuccess({
  //                 items: authors,
  //                 filter,
  //               });
  //             },
  //             error: (error: ResponseError) => {
  //               return browseActions.getFilterFailure({ error });
  //             },
  //           }),
  //         ),
  //     ),
  //   ),
  // );

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

  // getTagFilter = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(browseActions.getFilter),
  //     filter(({ filter }) => filter === 'tag'),
  //     map(({ name, filter }) => {
  //       const tags = allBookTags.filter((tag) =>
  //         tag.toLowerCase().includes(name?.toLowerCase() ?? ''),
  //       );
  //
  //       return browseActions.getFilterSuccess({ items: tags, filter });
  //     }),
  //   ),
  // );
}
