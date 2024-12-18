import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Book, BookTag, ResponseError } from '@e-commerce/shared/api-models';
import { BooksApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type BookState = {
  loading: boolean;
  error: string | null;
  books: {
    [BookTag.BESTSELLER]: Book[];
    [BookTag.INCOMING]: Book[];
    [BookTag.NEW]: Book[];
  };
};

const initialHomeState: BookState = {
  loading: false,
  error: null,
  books: {
    [BookTag.BESTSELLER]: [],
    [BookTag.INCOMING]: [],
    [BookTag.NEW]: [],
  },
};

export const HomeStore = signalStore(
  withState(initialHomeState),
  withComputed(({ books }) => ({
    bestsellersBooks: computed(() => books()[BookTag.BESTSELLER]),
    incomingBooks: computed(() => books()[BookTag.INCOMING]),
    newBooks: computed(() => books()[BookTag.NEW]),
  })),
  withMethods((store, booksApi = inject(BooksApiService)) => ({
    getBooks$: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          booksApi
            .getBooks$({
              tagIn: [BookTag.BESTSELLER, BookTag.INCOMING, BookTag.NEW],
              size: 12,
            })
            .pipe(
              tapResponse({
                next: ({ items }) => {
                  const books = items.reduce(
                    (acc, book) => {
                      switch (book.tag) {
                        case BookTag.BESTSELLER:
                          acc[BookTag.BESTSELLER].push(book);
                          break;
                        case BookTag.INCOMING:
                          acc[BookTag.INCOMING].push(book);
                          break;
                        case BookTag.NEW:
                          acc[BookTag.NEW].push(book);
                          break;
                      }

                      return acc;
                    },
                    {
                      [BookTag.BESTSELLER]: [] as Book[],
                      [BookTag.INCOMING]: [] as Book[],
                      [BookTag.NEW]: [] as Book[],
                    },
                  );

                  patchState(store, {
                    books,
                    loading: false,
                    error: null,
                  });
                },
                error: (error: ResponseError) => {
                  patchState(store, {
                    books: initialHomeState.books,
                    loading: false,
                    error:
                      error?.error?.message ||
                      'Error occur while getting books',
                  });
                },
              }),
            ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit: (store) => {
      store.getBooks$();
    },
  }),
);
