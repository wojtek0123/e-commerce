import { inject } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { authActions } from './auth.actions';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { selectLoginForm, selectRegisterForm } from './auth.selectors';
import { validateRegisterForm } from './auth.reducer';
import { formGroupReducer } from 'ngrx-forms';

export const login$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(authActions.login),
      concatLatestFrom(() => store.select(selectLoginForm)),
      switchMap(([, form]) =>
        authService.login$(form.value.email, form.value.password).pipe(
          map(({ accessToken }) => authActions.loginSuccess({ accessToken })),
          catchError((error) => of(authActions.loginFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const register$ = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(authActions.register),
      concatLatestFrom(() => store.select(selectRegisterForm)),
      switchMap(([, form]) =>
        authService.register$(form.value.email, form.value.password).pipe(
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
