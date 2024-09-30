import { inject, Injectable } from '@angular/core';
import {
  AuthApiService,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { authActions } from './auth.actions';
import { filter, map, switchMap, tap } from 'rxjs';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { selectRefreshToken, selectUserId } from './auth.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private authApi = inject(AuthApiService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  init = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.init),
      map(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');

        if (!accessToken || !refreshToken || !userId) {
          return authActions.initFailure();
        }

        return authActions.initSuccess({
          tokens: { accessToken, refreshToken },
          userId,
        });
      }),
    ),
  );

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      switchMap(({ email, password }) =>
        this.authApi.login$(email, password).pipe(
          mapResponse({
            next: ({ tokens, user }) => {
              this.messageService.add({
                severity: 'success',
                detail: 'You have been logged in',
                summary: 'Success',
              });
              return authActions.loginSuccess({ tokens, user });
            },
            error: (error: ResponseError) => {
              this.messageService.add({
                severity: 'error',
                detail: Array.isArray(error.message)
                  ? error.message.join('. ')
                  : error.message || 'Error occur while logging in',
                summary: 'Error',
              });
              return authActions.loginFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  register = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.register),
      switchMap(({ email, password }) =>
        this.authApi.register$(email, password).pipe(
          mapResponse({
            next: ({ tokens, user }) => {
              this.messageService.add({
                severity: 'success',
                detail: 'You have been registered',
                summary: 'Success',
              });
              return authActions.registerSuccess({ tokens, user });
            },
            error: (error: ResponseError) => {
              this.messageService.add({
                severity: 'error',
                detail: Array.isArray(error.message)
                  ? error.message.join('. ')
                  : error.message || 'Error occur while signing in',
                summary: 'Error',
              });
              return authActions.registerFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  redirectAfterSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.registerSuccess, authActions.loginSuccess),
        tap(({ tokens, user }) => {
          localStorage.setItem('refreshToken', tokens.refreshToken);
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('userId', user.id.toString());
          const url = this.route.snapshot.queryParams['returnToOrderProcess']
            ? '/order'
            : '/';

          this.router.navigate([url]);
        }),
      ),
    { dispatch: false },
  );

  refreshToken = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshToken),
      concatLatestFrom(() => [
        this.store.select(selectUserId),
        this.store.select(selectRefreshToken),
      ]),
      filter(([, userId, refreshToken]) => !!userId && !!refreshToken),
      switchMap(([, userId, refreshToken]) =>
        this.authApi.getRefreshToken$(userId!, refreshToken!).pipe(
          mapResponse({
            next: ({ accessToken, refreshToken }) => {
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('accessToken', accessToken);

              return authActions.refreshTokenSuccess({
                accessToken,
                refreshToken,
              });
            },
            error: (error: ResponseError) => {
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('userId');
              return authActions.refreshTokenFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  refreshTokenSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.refreshTokenSuccess),
        tap(({ refreshToken, accessToken }) => {
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('accessToken', accessToken);
        }),
      ),
    { dispatch: false },
  );

  logout = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      concatLatestFrom(() => this.store.select(selectUserId)),
      filter(([, userId]) => !!userId),
      switchMap(([, userId]) =>
        this.authApi.logout$(userId!).pipe(
          mapResponse({
            next: () => {
              this.messageService.add({
                severity: 'success',
                detail: 'You have been logged out',
                summary: 'Success',
              });
              return authActions.logoutSuccess();
            },
            error: (error: ResponseError) => {
              this.messageService.add({
                severity: 'error',
                detail: Array.isArray(error.message)
                  ? error.message.join('. ')
                  : error.message || 'Error occur while logging out',
                summary: 'Error',
              });
              return authActions.logoutFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  logoutSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('userId');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessToken');
        }),
      ),
    { dispatch: false },
  );
}
