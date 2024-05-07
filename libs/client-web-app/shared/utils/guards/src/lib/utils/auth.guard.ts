import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export const authGuard: CanActivateFn = (
  _next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (!accessToken || !refreshToken) {
    router.navigate(['/auth/login']);
    return true;
  }
  // else if (state.url.includes('auth')) {
  //   router.navigate(['/']);
  //   return false;
  // }

  return true;
};
