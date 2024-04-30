import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  ApiStatus,
  Book,
  BookTag,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { BooksApiService } from '../services/books-api.service';
import { tapResponse } from '@ngrx/operators';

interface BooksState {
  books: Book[];
  status: ApiStatus;
}

const initialBooksState: BooksState = {
  books: [],
  status: 'idle',
};

export const BooksStore = signalStore(
  withState(initialBooksState),
  withMethods((store, booksApi = inject(BooksApiService)) => ({
    getBooks: rxMethod<{ categoryIds?: number[]; tag?: BookTag }>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(({ tag, categoryIds }) =>
          booksApi.getBooks$({ tag, categoryIds }).pipe(
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
  }))
);
