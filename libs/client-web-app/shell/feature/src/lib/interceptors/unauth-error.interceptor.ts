import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import {
  AuthService,
  authActions,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

export const unAuthErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpResponse<Record<string, string>>) => {
      if (
        !(req.url.includes('auth/login') || req.url.includes('auth/refresh')) &&
        error.status === 401
      ) {
        const session = authService.getSession();
        if (session?.tokens.refreshToken) {
          return authService
            .getRefreshToken$(session.user.id, session.tokens.refreshToken)
            .pipe(
              switchMap((tokens) => {
                store.dispatch(authActions.getRefreshTokenSuccess({ tokens }));

                return next(
                  req.clone({
                    headers: req.headers.set(
                      'Authorization',
                      `Bearer ${tokens.accessToken}`
                    ),
                  })
                );
              }),
              catchError((error) => {
                if (error.status === 401 || error.status === 403) {
                  authService.logout$(session.user.id);
                  store.dispatch(authActions.getRefreshTokenFailure(error));
                }
                return of(error);
              })
            );
        }
      }
      return of(error);
    })
  );
};
