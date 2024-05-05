import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
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
import { ActivatedRoute, Router } from '@angular/router';
import { BooksFilters } from '../models/books-filters.model';

interface BooksState {
  books: Book[];
  status: ApiStatus;
  filters: BooksFilters;
}

const initialBooksState: BooksState = {
  books: [],
  status: 'idle',
  filters: {
    title: null,
    tags: null,
    categories: null,
  },
};

export const BooksStore = signalStore(
  withState(initialBooksState),
  withMethods(
    (
      store,
      booksApi = inject(BooksApiService),
      route = inject(ActivatedRoute),
      router = inject(Router)
    ) => ({
      getFilterBooks: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { status: 'loading' })),
          switchMap(() =>
            booksApi
              .getBooks$({
                tagsIn: store.filters.tags() ?? undefined,
                title: store.filters.title() ?? undefined,
                categoryIds:
                  store.filters.categories()?.map((c) => c?.id) ?? undefined,
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
      updateFilterCategories: (categories: Category[] | null) => {
        patchState(store, (state) => ({
          filters: { ...state.filters, categories },
        }));

        const queryCats = categories
          ?.map((c) => c?.name.toLowerCase().split(' ').join('_'))
          .join(',');

        router.navigate([], {
          relativeTo: route,
          queryParams: {
            categories: queryCats || null,
          },
          queryParamsHandling: 'merge',
        });
      },
      updateFilterTags: (tags: BookTag[] | null) => {
        patchState(store, (state) => ({ filters: { ...state.filters, tags } }));

        router.navigate([], {
          relativeTo: route,
          queryParams: { tags: tags?.join(',') || null },
          queryParamsHandling: 'merge',
        });
      },
      updateFilterTitle: (value: string | null) => {
        patchState(store, (state) => ({
          filters: { ...state.filters, title: value },
        }));

        router.navigate([], {
          relativeTo: route,
          queryParams: { search: value },
          queryParamsHandling: 'merge',
        });
      },
      clearFilters: () => {
        patchState(store, (state) => ({
          filters: { ...initialBooksState.filters, title: state.filters.title },
        }));

        router.navigate([], {
          relativeTo: route,
          queryParams: { search: store.filters.title() },
        });
      },
      clearFilter: (filter: keyof BooksFilters) => {
        patchState(store, (state) => ({
          filters: { ...state.filters, [filter]: null },
        }));

        router.navigate([], {
          relativeTo: route,
          queryParams: { [filter]: null },
          queryParamsHandling: 'merge',
        });
      },
    })
  ),
  withHooks({
    onInit(store) {
      store.getFilterBooks();
      console.log('init');
    },
    onDestroy() {
      console.log('destroy');
    },
  })
);
