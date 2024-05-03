import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  ApiStatus,
  Book,
  BookTag,
  Category,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { BooksApiService } from '../services/books-api.service';
import { tapResponse } from '@ngrx/operators';

interface BooksFilters {
  title: string | null;
  tags: BookTag[] | null;
  categories: Category[] | null;
}

interface BooksState {
  books: Book[];
  categories: Category[];
  status: ApiStatus;
  filters: BooksFilters;
}

const initialBooksState: BooksState = {
  books: [],
  categories: [],
  status: 'idle',
  filters: {
    title: null,
    tags: null,
    categories: null,
  },
};

export const BooksStore = signalStore(
  withState(initialBooksState),
  withMethods((store, booksApi = inject(BooksApiService)) => ({
    getBooks: rxMethod<{ categoryIds?: number[]; tags?: BookTag[] }>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(({ tags, categoryIds }) =>
          booksApi.getBooks$({ tagsIn: tags, categoryIds }).pipe(
            tapResponse({
              next: (books) => {
                patchState(store, { status: 'ok', books });
              },
              error: (responseError: ResponseError) => {
                patchState(store, {
                  status: { error: responseError.error.message },
                });
              },
            })
          )
        )
      )
    ),
    filterBooks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(() =>
          booksApi
            .getBooks$({
              tagsIn: store.filters.tags() ?? undefined,
              title: store.filters.title() ?? undefined,
              categoryIds:
                store.filters.categories()?.map((c) => c.id) ?? undefined,
            })
            .pipe(
              tapResponse({
                next: (books) => patchState(store, { status: 'ok', books }),
                error: (responseError: ResponseError) =>
                  patchState(store, {
                    status: { error: responseError.error.message },
                  }),
              })
            )
        )
      )
    ),
    setFilters: (filters: Partial<BooksFilters>) => {
      patchState(store, { filters: { ...store.filters(), ...filters } });

      // const queryParams: Params = {};

      // router.navigate([], {
      //   relativeTo: route,
      //   queryParams,
      //   queryParamsHandling: 'merge',
      // });
    },
  }))
);
