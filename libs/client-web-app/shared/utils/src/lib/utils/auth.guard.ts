import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';

export const authGuard: CanActivateFn = (
  _next: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  return false;
};
