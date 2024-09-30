import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  Book,
  BooksApiService,
  BookTag,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { mergeMap, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type BookState = {
  loading: boolean;
  error: string | null;
  books: Book[];
};

const initialBookState: BookState = {
  loading: false,
  error: null,
  books: [],
};

export type HomeState = {
  bestsellers: BookState;
  incoming: BookState;
  new: BookState;
};

const initialHomeState: HomeState = {
  bestsellers: initialBookState,
  incoming: initialBookState,
  new: initialBookState,
};

export const HomeStore = signalStore(
  withState(initialHomeState),
  withMethods((store, booksApi = inject(BooksApiService)) => ({
    getBooks: rxMethod<[keyof HomeState, BookTag]>(
      pipe(
        tap(([tag]) =>
          patchState(store, (state) => ({
            ...state,
            [tag]: { ...state[tag], loading: true },
          })),
        ),
        mergeMap(([tag, bookTag]) =>
          booksApi
            .getBooks$({
              tagIn: [bookTag],
              size: 5,
            })
            .pipe(
              tapResponse({
                next: ({ items }) => {
                  patchState(store, (state) => ({
                    ...state,
                    [tag]: {
                      ...state[tag],
                      loading: false,
                      books: items,
                    },
                  }));
                },
                error: (error: ResponseError) => {
                  patchState(store, (state) => ({
                    ...state,
                    [tag]: {
                      ...state[tag],
                      loading: false,
                      error: error.message,
                    },
                  }));
                },
              }),
            ),
        ),
      ),
    ),
  })),
);
