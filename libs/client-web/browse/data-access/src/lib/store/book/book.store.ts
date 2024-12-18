import { computed, inject } from '@angular/core';
import { BookDetails, ResponseError } from '@e-commerce/shared/api-models';
import { BooksApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export interface BookState {
  book: BookDetails | null;
  loading: boolean;
  error: string | string[] | null;
}

export const initialBookState: BookState = {
  book: null,
  loading: false,
  error: null,
};

export const BookStore = signalStore(
  withState(initialBookState),
  withComputed(({ book }) => ({
    availableQuantity: computed(() => book()?.productInventory.quantity ?? 0),
  })),
  withMethods((store, bookApi = inject(BooksApiService)) => ({
    getBook$: rxMethod<{ bookId: BookDetails['id'] }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ bookId }) =>
          bookApi.getBook$(bookId).pipe(
            tapResponse({
              next: (book) => {
                patchState(store, { book, loading: false, error: null });
              },
              error: (error: ResponseError) => {
                patchState(store, {
                  loading: false,
                  book: null,
                  error:
                    error?.error?.message ||
                    'Error occur while getting book details',
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
