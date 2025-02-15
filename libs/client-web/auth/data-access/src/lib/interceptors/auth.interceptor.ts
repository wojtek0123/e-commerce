import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { inject } from '@angular/core';
import { AuthApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { ResponseError } from '@e-commerce/shared/api-models';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authApi = inject(AuthApiService);
  const authStore = inject(AuthStore);
  const refreshToken = authStore.refreshToken();
  const accessToken = authStore.accessToken();
  const userId = authStore.userId();
  const appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  if (!accessToken)
    return next(
      request.clone({
        headers: request.headers.set('app', 'client-web'),
      }),
    );

  const clonedRequest = request.clone({
    headers: request.headers
      .set(
        'Authorization',
        `Bearer ${
          request.url.includes('auth/refresh') ? refreshToken : accessToken
        }`,
      )
      .set('app', 'client-web'),
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && error.url.includes('refresh')) {
        // TODO: Add text to toast that user session has expired.
        authStore.logout();
        return throwError(() => error);
      }
      if (error.status === 401 && accessToken) {
        if (!userId || !refreshToken) return throwError(() => error);

        return authApi.getRefreshToken$(userId, refreshToken).pipe(
          switchMap((tokens) => {
            authStore.updateTokens(tokens);

            return next(
              request.clone({
                headers: request.headers.set(
                  'Authorization',
                  `Bearer ${tokens.accessToken}`,
                ),
              }),
            );
          }),
          catchError((error: ResponseError) => {
            if (
              error?.error?.statusCode === 401 ||
              (error?.error?.statusCode === 403 &&
                request.url !== appRoutePaths.LOGIN() &&
                request.url !== appRoutePaths.REGISTER())
            ) {
              authStore.logout();
            }
            return throwError(() => error);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
