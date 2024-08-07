import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/stores';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  return toObservable(inject(AuthService).tokens).pipe(
    switchMap((tokens) => {
      if (!tokens?.accessToken) return next(request);

      const clonedRequest = request.clone({
        headers: request.headers.set(
          'Authorization',
          `Bearer ${
            request.url.includes('auth/refresh')
              ? tokens.refreshToken
              : tokens.accessToken
          }`,
        ),
      });
      return next(clonedRequest);
    }),
  );
};
