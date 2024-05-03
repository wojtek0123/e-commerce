import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import {
  AuthService,
  AuthStore,
} from '@e-commerce/client-web-app/shared/data-access/auth';
import { inject } from '@angular/core';

export const unAuthErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authStore = inject(AuthStore);
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
                authStore.setTokens(tokens);

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
                }
                return of(error);
              })
            );
        }
      }
      return throwError(() => error);
    })
  );
};