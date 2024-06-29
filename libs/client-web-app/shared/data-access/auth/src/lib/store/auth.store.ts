import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  ApiStatus,
  ResponseError,
  Tokens,
  User,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { computed, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tapResponse } from '@ngrx/operators';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  status: ApiStatus;
}

const initialAuthState: AuthState = {
  user: null,
  tokens: null,
  status: 'idle',
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthState),
  withComputed(({ user }) => ({
    userId: computed(() => user()?.id),
  })),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      messageService = inject(MessageService)
    ) => ({
      login: rxMethod<{ email: string; password: string; valid: boolean }>(
        pipe(
          tap(({ valid }) => {
            if (!valid) {
              patchState(store, {
                status: { error: 'Form is incorrectly filled out' },
              });
            }
          }),
          filter(({ valid }) => !!valid),
          tap(() => patchState(store, { status: 'loading' })),
          switchMap(({ email, password }) =>
            authService.login$(email, password).pipe(
              tapResponse({
                next: (session) => {
                  patchState(store, {
                    user: session.user,
                    tokens: session.tokens,
                    status: 'ok',
                  });
                  messageService.add({
                    severity: 'success',
                    detail: 'You have successfully logged in',
                    summary: 'Success',
                  });
                },
                error: (responseError: ResponseError) => {
                  patchState(store, {
                    status: { error: responseError.error.message },
                  });
                  messageService.add({
                    severity: 'error',
                    detail: `${responseError.error.message}`,
                    summary: 'Error',
                  });
                },
              })
            )
          )
        )
      ),
      register: rxMethod<{ email: string; password: string; valid: boolean }>(
        pipe(
          tap(({ valid }) => {
            if (!valid) {
              patchState(store, {
                status: { error: 'Form is incorrectly filled out' },
              });
            }
          }),
          filter(({ valid }) => !!valid),
          tap(() => patchState(store, { status: 'loading' })),
          switchMap(({ email, password }) =>
            authService.register$(email, password).pipe(
              tapResponse({
                next: (session) => {
                  patchState(store, {
                    user: session.user,
                    tokens: session.tokens,
                    status: 'ok',
                  });
                  messageService.add({
                    severity: 'success',
                    detail: 'You have successfully register',
                    summary: 'Success',
                  });
                },
                error: (responseError: ResponseError) => {
                  patchState(store, {
                    status: { error: responseError.error.message },
                  });
                  messageService.add({
                    severity: 'error',
                    detail: `${responseError.error.message}`,
                    summary: 'Error',
                  });
                },
              })
            )
          )
        )
      ),
      refreshToken: rxMethod<{
        userId: User['id'];
        refreshToken: Tokens['refreshToken'];
      }>(
        pipe(
          switchMap(({ userId, refreshToken }) =>
            authService.getRefreshToken$(userId, refreshToken).pipe(
              tapResponse({
                next: (tokens) => patchState(store, { tokens }),
                error: (responseError: ResponseError) =>
                  patchState(store, {
                    status: { error: responseError.error.message },
                  }),
              })
            )
          )
        )
      ),
      logout() {
        authService
          .logout$(store.userId() ?? '')
          .pipe(
            tapResponse({
              next: () => {
                patchState(store, { user: null, tokens: null });
                authService.removeSession();
                messageService.add({
                  severity: 'success',
                  detail: 'You have successfully logout',
                  summary: 'Success',
                });
              },
              error: (responseError: ResponseError) => {
                patchState(store, {
                  status: { error: responseError.error.message },
                });

                messageService.add({
                  severity: 'error',
                  detail: `${responseError.error.message}`,
                  summary: 'Error',
                });
              },
            })
          )
          .subscribe();
      },
      setTokens(tokens: Tokens) {
        patchState(store, { tokens });
      },
      init() {
        const session = authService.getSession();
        patchState(store, { user: session?.user, tokens: session?.tokens });
      },
      resetStatus() {
        patchState(store, { status: 'idle' });
      },
    })
  ),
  withHooks({
    onInit(store) {
      store.init();
    },
  })
);
