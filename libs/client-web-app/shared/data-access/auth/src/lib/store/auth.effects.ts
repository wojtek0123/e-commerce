import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authActions } from './auth.actions';

export const login$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(authActions.login),
      filter(({ valid }) => valid),
      switchMap(({ email, password }) =>
        authService.login$(email, password).pipe(
          map(({ accessToken, user }) =>
            authActions.loginSuccess({ accessToken, user })
          ),
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
          map(({ accessToken, user }) =>
            authActions.registerSuccess({ accessToken, user })
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

export const loginSuccess$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(authActions.loginSuccess),
      tap(({ accessToken, user }) => {
        authService.setSession({ accessToken, user });
      })
    );
  },
  { functional: true, dispatch: false }
);

export const init$ = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(authActions.init),
      map(() => {
        const session = authService.getSession();

        return authActions.initSuccess({ session });
      })
    );
  },
  { functional: true }
);
