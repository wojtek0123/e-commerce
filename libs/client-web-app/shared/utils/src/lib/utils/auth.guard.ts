import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { authSelectors } from '@e-commerce/client-web-app/shared/data-access/auth';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (
  _next: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authSelectors.selectTokens).pipe(
    map((tokens) => !!tokens),
    tap((hasAccess) => {
      if (!hasAccess) router.navigate(['/auth/login']);
      if (hasAccess && _state.url.includes('auth')) router.navigate(['/']);
    })
  );
};
