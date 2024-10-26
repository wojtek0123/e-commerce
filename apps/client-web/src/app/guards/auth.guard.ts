import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@e-commerce/client-web/auth/api';

export const canMatchAuth: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuth = authService.isAuthenticated();

  return (
    isAuth ||
    router.createUrlTree(['/login'], {
      queryParams: { 'redirect-to': 'order-process' },
    })
  );
};
