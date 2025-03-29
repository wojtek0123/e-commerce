import { computed, inject } from '@angular/core';
import {
  Book,
  BookDetails,
  ResponseError,
  User,
} from '@e-commerce/shared/api-models';
import {
  BookReviewApiService,
  BooksApiService,
  OrderDetailsApiService,
} from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

export interface BookState {
  book: BookDetails | null;
  loading: boolean;
  error: string | string[] | null;
  purchased: boolean;
  reviewDialog: {
    loading: boolean;
    visible: boolean;
    error: string | null;
  };
}

export const initialBookState: BookState = {
  book: null,
  loading: false,
  error: null,
  purchased: false,
  reviewDialog: {
    loading: false,
    visible: false,
    error: null,
  },
};

export const BookStore = signalStore(
  withState(initialBookState),
  withComputed(({ book }) => ({
    availableQuantity: computed(() => book()?.inventory.quantity ?? 0),
    reviews: computed(() => book()?.reviews ?? []),
  })),
  withProps(() => ({
    bookApi: inject(BooksApiService),
    bookReviewApi: inject(BookReviewApiService),
    orderDetailsApi: inject(OrderDetailsApiService),
    messageService: inject(MessageService),
  })),
  withMethods((store) => ({
    getBook: rxMethod<{ bookId: BookDetails['id'] }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(({ bookId }) =>
          store.bookApi.getBook$(bookId).pipe(
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
    addReview: rxMethod<{
      name: string;
      rating: number;
      message: string;
    }>(
      pipe(
        map((body) => ({ bookId: getState(store).book!.id, ...body })),
        filter(({ bookId }) => !!bookId),
        tap(() =>
          patchState(store, (state) => ({
            reviewDialog: { ...state.reviewDialog, loading: true },
          })),
        ),
        switchMap((body) =>
          store.bookReviewApi.create({ ...body }).pipe(
            tapResponse({
              next: (bookReview) => {
                patchState(store, (state) => ({
                  ...state,
                  book: state.book
                    ? {
                        ...state.book,
                        reviews: [...state.book.reviews, bookReview],
                      }
                    : null,
                  reviewDialog: {
                    ...state.reviewDialog,
                    loading: false,
                    visible: false,
                  },
                }));

                store.messageService.add({
                  summary: 'Success',
                  detail: 'Review has been added',
                  severity: 'success',
                });
              },
              error: (error: ResponseError) => {
                patchState(store, (state) => ({
                  reviewDialog: {
                    ...state.reviewDialog,
                    loading: false,
                  },
                }));
                store.messageService.add({
                  summary: 'Error',
                  detail:
                    error?.error?.message ??
                    'Error occurred while adding a review',
                  severity: 'error',
                });
              },
            }),
          ),
        ),
      ),
    ),
    getOrderByBook: rxMethod<void>(
      pipe(
        map(() => getState(store).book?.id),
        filter((bookId): bookId is Book['id'] => !!bookId),
        switchMap((bookId) =>
          store.orderDetailsApi.getOrderByBook(bookId).pipe(
            tapResponse({
              next: () => {
                patchState(store, { purchased: true });
              },
              error: () => {
                patchState(store, { purchased: false });
              },
            }),
          ),
        ),
      ),
    ),
    isUserAddedReview: (userId: User['id']) => {
      return !!getState(store).book?.reviews.find(
        (review) => review.userId === userId,
      );
    },
    toggleReviewDialog: () => {
      patchState(store, (state) => ({
        reviewDialog: {
          ...state.reviewDialog,
          visible: !state.reviewDialog.visible,
        },
      }));
    },
  })),
);
