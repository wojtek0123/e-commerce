import { inject } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { authActions } from './auth.actions';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';

export const login$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(authActions.login),
      tap((data) => console.log(data)),
      switchMap((action) =>
        authService.login$(action.email, action.password).pipe(
          map(({ accessToken }) => authActions.loginSuccess({ accessToken })),
          catchError((error) => of(authActions.loginFailure({ error })))
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
      tap((data) => console.log(data)),
      switchMap(({ email, password }) =>
        authService.register$(email, password).pipe(
          map(({ accessToken }) =>
            authActions.registerSuccess({ accessToken })
          ),
          catchError((error) => of(authActions.loginFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);
