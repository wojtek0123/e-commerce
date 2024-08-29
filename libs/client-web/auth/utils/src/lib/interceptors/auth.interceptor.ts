import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  selectAccessToken,
  selectRefreshToken,
} from '@e-commerce/client-web/auth/data-access';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);
  const accessToken = store.selectSignal(selectAccessToken);
  const refreshToken = store.selectSignal(selectRefreshToken);

  // return combineLatest({
  //   accessToken: accessToken$,
  //   refreshToken: refreshToken$,
  // }).pipe(
  //   switchMap(({ accessToken, refreshToken }) => {
  //     console.log('here');
  if (!accessToken()) return next(request);

  const clonedRequest = request.clone({
    headers: request.headers.set(
      'Authorization',
      `Bearer ${
        request.url.includes('auth/refresh') ? refreshToken() : accessToken()
      }`,
    ),
  });
  return next(clonedRequest);
  //   }),
  //   take(2),
  // );
};
