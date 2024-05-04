import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Category } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CategoryStore } from '@e-commerce/client-web-app/shared/data-access/category';
import { filter } from 'rxjs';

export const categoriesResolver: ResolveFn<Category[]> = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const categoryStore = inject(CategoryStore);

  return toObservable(categoryStore.categories).pipe(
    filter((categories) => !!categories.length)
  );
};
