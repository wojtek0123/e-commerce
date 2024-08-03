import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/stores';
import { inject } from '@angular/core';

export const unAuthErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpResponse<Record<string, string>>) => {
      if (
        !(req.url.includes('auth/login') || req.url.includes('auth/refresh')) &&
        error.status === 401
      ) {
        const refreshToken = authService.tokens()?.refreshToken;
        const userId = authService.userId();

        if (refreshToken && userId) {
          return authService.refreshToken$(userId, refreshToken).pipe(
            switchMap((tokens) => {
              authService.setTokens(tokens);

              return next(
                req.clone({
                  headers: req.headers.set(
                    'Authorization',
                    `Bearer ${tokens.accessToken}`,
                  ),
                }),
              );
            }),
            catchError((error) => {
              if (error.status === 401 || error.status === 403) {
                authService.removeSession();
              }
              return of(error);
            }),
          );
        }
      }
      return throwError(() => error);
    }),
  );
};
