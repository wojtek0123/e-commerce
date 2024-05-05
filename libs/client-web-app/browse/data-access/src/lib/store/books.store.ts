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
import { RouterConfig } from '@e-commerce/client-web-app/browse/utils/router-config';

interface BooksState {
  books: Book[];
  status: ApiStatus;
  filters: BooksFilters;
}

const initialBooksState: BooksState = {
  books: [],
  status: 'idle',
  filters: {
    search: null,
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
                title: store.filters.search() ?? undefined,
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
            [RouterConfig.categoriesQueryParams]: queryCats || null,
          },
          queryParamsHandling: 'merge',
        });
      },
      updateFilterTags: (tags: BookTag[] | null) => {
        patchState(store, (state) => ({ filters: { ...state.filters, tags } }));

        router.navigate([], {
          relativeTo: route,
          queryParams: {
            [RouterConfig.tagsQueryParams]: tags?.join(',') || null,
          },
          queryParamsHandling: 'merge',
        });
      },
      updateFilterTitle: (value: string | null) => {
        patchState(store, (state) => ({
          filters: { ...state.filters, title: value },
        }));

        router.navigate([], {
          relativeTo: route,
          queryParams: { [RouterConfig.searchQueryParams]: value },
          queryParamsHandling: 'merge',
        });
      },
      clearFilters: () => {
        patchState(store, (state) => ({
          filters: {
            ...initialBooksState.filters,
            title: state.filters.search,
          },
        }));

        router.navigate([], {
          relativeTo: route,
          queryParams: {
            [RouterConfig.searchQueryParams]: store.filters.search(),
          },
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
    },
  })
);
