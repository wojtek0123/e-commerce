import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authActions } from './auth.actions';

export const login$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(authActions.login),
      filter(({ valid }) => valid),
      switchMap(({ email, password }) =>
        authService.login$(email, password).pipe(
          map(({ accessToken }) => authActions.loginSuccess({ accessToken })),
          catchError((responseError) =>
            of(authActions.loginFailure({ responseError }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const register$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(authActions.register),
      filter(({ valid }) => valid),
      switchMap(({ email, password }) =>
        authService.register$(email, password).pipe(
          map(({ accessToken }) =>
            authActions.registerSuccess({ accessToken })
          ),
          catchError((responseError) =>
            of(authActions.loginFailure({ responseError: responseError }))
          )
        )
      )
    );
  },
  { functional: true }
);
