import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '@e-commerce/client-web/auth/api';
import { inject } from '@angular/core';
import {
  AuthApiService,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authApi = inject(AuthApiService);
  const authService = inject(AuthService);
  const refreshToken = authService.refreshToken();
  const accessToken = authService.accessToken();
  const userId = authService.userId();

  if (!accessToken) return next(request);

  const clonedRequest = request.clone({
    headers: request.headers.set(
      'Authorization',
      `Bearer ${
        request.url.includes('auth/refresh') ? refreshToken : accessToken
      }`
    ),
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && accessToken) {
        if (!userId || !refreshToken) return throwError(() => error);

        return authApi.getRefreshToken$(userId, refreshToken).pipe(
          switchMap((tokens) => {
            authService.updateTokens(tokens);

            return next(
              request.clone({
                headers: request.headers.set(
                  'Authorization',
                  `Bearer ${tokens.accessToken}`
                ),
              })
            );
          }),
          catchError((error: ResponseError) => {
            if (
              error?.error?.statusCode === 401 ||
              (error?.error?.statusCode === 403 &&
                request.url !== '/login' &&
                request.url !== '/register')
            ) {
              authService.logout();
            }
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
