import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  authActions,
  selectRefreshToken,
  selectUserId,
} from '@e-commerce/client-web/auth/data-access';
import { AuthApiService } from '@e-commerce/client-web/shared/data-access';

export const unAuthErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authApi = inject(AuthApiService);
  const store = inject(Store);
  const userId = store.selectSignal(selectUserId);
  const refreshToken = store.selectSignal(selectRefreshToken);

  return next(req).pipe(
    catchError((error: HttpResponse<Record<string, string>>) => {
      if (
        !(req.url.includes('auth/login') || req.url.includes('auth/refresh')) &&
        error.status === 401
      ) {
        if (refreshToken() && userId()) {
          return authApi.getRefreshToken$(userId()!, refreshToken()!).pipe(
            switchMap((tokens) => {
              store.dispatch(
                authActions.refreshToken({
                  userId: userId()!,
                  refreshToken: refreshToken()!,
                }),
              );

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
                store.dispatch(authActions.logout());
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
