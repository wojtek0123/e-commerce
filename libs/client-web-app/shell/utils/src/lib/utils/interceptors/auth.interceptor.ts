import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { authSelectors } from '@e-commerce/client-web-app/shared/data-access/auth';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return inject(Store)
    .select(authSelectors.selectTokens)
    .pipe(
      take(1),
      switchMap((tokens) => {
        if (!tokens?.accessToken) return next(request);

        const clonedRequest = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${
              request.url.includes('auth/refresh')
                ? tokens.refreshToken
                : tokens.accessToken
            }`
          ),
        });
        return next(clonedRequest);
      })
    );
};
