import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStore } from '@e-commerce/client-web-app/shared/data-access/auth';

export const resetAuthStatusResolver: ResolveFn<void> = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const authStore = inject(AuthStore);

  return authStore.resetStatus();
};
