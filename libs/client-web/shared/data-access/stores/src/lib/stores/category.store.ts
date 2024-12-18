import { inject } from '@angular/core';
import { Category, ResponseError } from '@e-commerce/shared/api-models';
import { CategoryApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

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
  withMethods((store, categoryApi = inject(CategoryApiService)) => ({
    getCategories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          categoryApi.getCategories$({}).pipe(
            tapResponse({
              next: (categories) => {
                patchState(store, { loading: false, categories });
              },

              error: (error: ResponseError) => {
                patchState(store, {
                  loading: false,
                  error:
                    error?.error?.message ||
                    'Error occur while getting categories',
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
