import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import {
  authActions,
  selectAccessToken,
  selectRefreshToken,
  selectUserId,
} from '@e-commerce/client-web/auth/data-access';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import {
  AuthApiService,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authApi = inject(AuthApiService);
  const store = inject(Store);
  const accessToken = store.selectSignal(selectAccessToken);
  const refreshToken = store.selectSignal(selectRefreshToken);

  if (!accessToken()) return next(request);

  const clonedRequest = request.clone({
    headers: request.headers.set(
      'Authorization',
      `Bearer ${
        request.url.includes('auth/refresh') ? refreshToken() : accessToken()
      }`,
    ),
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && accessToken()) {
        const userId = store.selectSignal(selectUserId);

        return authApi.getRefreshToken$(userId()!, refreshToken()!).pipe(
          switchMap((tokens) => {
            store.dispatch(
              authActions.refreshTokenSuccess({
                accessToken: tokens.accessToken!,
                refreshToken: tokens.refreshToken!,
              }),
            );

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
            console.log(request.url);
            if (
              error?.error?.statusCode === 401 ||
              (error?.error?.statusCode === 403 &&
                request.url !== '/login' &&
                request.url !== '/register')
            ) {
              store.dispatch(authActions.logout());
            }
            return throwError(() => error);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
