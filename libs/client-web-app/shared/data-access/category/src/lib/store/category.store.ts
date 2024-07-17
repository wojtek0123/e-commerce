import { computed, inject } from '@angular/core';
import {
  ApiStatus,
  Category,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { CategoryApiService } from '../services/category-api.service';
import { tapResponse } from '@ngrx/operators';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialCategoryState),
  withComputed(({ categories }) => ({
    categoriesCount: computed(() => categories().length),
  })),
  withMethods((store, categoryApi = inject(CategoryApiService)) => ({
    getCategories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          categoryApi.getCategories$().pipe(
            tapResponse({
              next: (categories) =>
                patchState(store, { categories, loading: false }),
              error: (responseError: ResponseError) => {
                patchState(store, {
                  loading: false,
                  error: responseError.error.message,
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.getCategories();
    },
  }),
);
