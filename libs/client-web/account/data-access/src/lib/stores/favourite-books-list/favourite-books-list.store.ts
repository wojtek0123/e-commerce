import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Book, ResponseError } from '@e-commerce/shared/api-models';
import { FavouriteBooksListApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { MessageService } from 'primeng/api';
import { UnauthorizedDialogService } from '@e-commerce/client-web/shared/data-access/services';
import { AuthService } from '@e-commerce/client-web/auth/api';

interface FavouriteBooksListState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialFavouriteBooksListState: FavouriteBooksListState = {
  books: [],
  loading: false,
  error: null,
};

export const FavouriteBooksListStore = signalStore(
  { providedIn: 'root' },
  withState(initialFavouriteBooksListState),
  withProps(() => ({
    _favouriteBooksListApi: inject(FavouriteBooksListApiService),
    _messageService: inject(MessageService),
    _unauthorizedDialogService: inject(UnauthorizedDialogService),
    _authService: inject(AuthService),
  })),
  withMethods((store) => ({
    getFavouriteBooks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          store._favouriteBooksListApi.get().pipe(
            tapResponse({
              next: ({ books }) => {
                patchState(store, {
                  loading: false,
                  error: null,
                  books: books ?? [],
                });
              },
              error: (error: ResponseError) => {
                patchState(store, {
                  loading: false,
                  books: [],
                  error:
                    error?.error?.message ??
                    'Error occurred while getting favourite books list',
                });
              },
            }),
          ),
        ),
      ),
    ),
    addToFavourite: rxMethod<{ bookId: Book['id'] }>(
      pipe(
        tap(() => {
          const isAuth = store._authService.isAuthenticated();

          if (!isAuth) {
            store._unauthorizedDialogService.show();
          }
        }),
        filter(() => store._authService.isAuthenticated()),
        switchMap(({ bookId }) =>
          store._favouriteBooksListApi.update({ bookId }).pipe(
            tapResponse({
              next: (favouriteBooksList) => {
                patchState(store, (state) => ({
                  books: state.books.find((b) => b.id === bookId)
                    ? state.books.filter((b) => b.id !== bookId)
                    : favouriteBooksList.books,
                }));
                store._messageService.add({
                  summary: 'Success',
                  detail: favouriteBooksList.books.find(
                    (book) => book.id === bookId,
                  )
                    ? 'Book has been added to favourite'
                    : 'Book has been removed from favourite',
                  severity: 'success',
                });
              },
              error: (error: ResponseError) => {
                store._messageService.add({
                  summary: 'Error',
                  detail:
                    error?.error?.message ??
                    'Error occurred while adding book to favourite',
                  severity: 'error',
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
