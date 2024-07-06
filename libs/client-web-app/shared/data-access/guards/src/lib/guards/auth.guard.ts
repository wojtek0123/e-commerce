import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';

export const authGuard: CanActivateFn = (
  _next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const isAuthenticated = inject(AuthService).isAuthenticated;

  if (state.url.includes('auth')) {
    return isAuthenticated() ? router.createUrlTree(['/']) : true;
  }

  if (isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
