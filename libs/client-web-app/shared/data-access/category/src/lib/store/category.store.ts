import { inject } from '@angular/core';
import {
  ApiStatus,
  Category,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  patchState,
  signalStore,
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
  status: ApiStatus;
}

const initialCategoryState: CategoryState = {
  categories: [],
  status: 'idle',
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialCategoryState),
  withMethods((store, categoryApi = inject(CategoryApiService)) => ({
    getCategories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(() =>
          categoryApi.getCategories$().pipe(
            tapResponse({
              next: (categories) =>
                patchState(store, { categories, status: 'ok' }),
              error: (responseError: ResponseError) =>
                patchState(store, {
                  status: { error: responseError.error.message },
                }),
            })
          )
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.getCategories();
    },
  })
);
