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
import { BooksApiService } from '../../../../../shared/data-access/api-services/src/lib/books-api.service';
import { tapResponse } from '@ngrx/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksFilters } from '../models/books-filters.model';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

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
            [appRouterConfig.browse.categoriesQueryParams]: queryCats || null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      },
      updateFilterTags: (tags: BookTag[] | null) => {
        patchState(store, (state) => ({ filters: { ...state.filters, tags } }));

        router.navigate([], {
          relativeTo: route,
          queryParams: {
            [appRouterConfig.browse.tagsQueryParams]: tags?.join(',') || null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      },
      updateFilterTitle: (search: string | null) => {
        patchState(store, (state) => ({
          filters: { ...state.filters, search },
        }));

        router.navigate([], {
          relativeTo: route,
          queryParams: { [appRouterConfig.browse.searchQueryParams]: search },
          queryParamsHandling: 'merge',
          replaceUrl: true,
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
            [appRouterConfig.browse.searchQueryParams]: store.filters.search(),
          },
          replaceUrl: true,
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
          replaceUrl: true,
        });
      },
      clearFiltersAndSearch: () => {
        patchState(store, (state) => ({
          filters: {
            ...initialBooksState.filters,
            title: state.filters.search,
          },
        }));

        router.navigate([], {
          relativeTo: route,
          queryParams: null,
          replaceUrl: true,
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
