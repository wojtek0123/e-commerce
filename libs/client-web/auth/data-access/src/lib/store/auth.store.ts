import {
  patchState,
  signalStore,
  withMethods,
  withState,
  withHooks,
  withComputed,
  watchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  AuthApiService,
  ResponseError,
  Tokens,
  User,
} from '@e-commerce/client-web/shared/data-access';
import { computed, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { filter, map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_STORAGE = 'accessToken' as const;
const REFRESH_TOKEN_STORAGE = 'refreshToken' as const;
const USER_ID_STORAGE = 'userId' as const;

export interface AuthState {
  userId: User['id'] | null;
  accessToken: Tokens['accessToken'] | null;
  refreshToken: Tokens['refreshToken'] | null;
  loading: boolean;
  error: string | null;
  event:
    | 'init-local'
    | 'init-database'
    | 'auth-success'
    | 'logout-success'
    | null;
}

export const initialAuthState: AuthState = {
  userId: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  event: null,
};

export const AuthStore = signalStore(
  withState(initialAuthState),
  withComputed(({ userId, accessToken, refreshToken }) => ({
    isAuthenticated: computed(
      () => !!userId() && !!accessToken() && !!refreshToken(),
    ),
  })),
  withMethods(
    (store, route = inject(ActivatedRoute), router = inject(Router)) => ({
      redirect: async () => {
        const url = route.snapshot.queryParams['redirect-to'];

        await router.navigate([url || '/']);
      },
      removeSession: () => {
        patchState(store, {
          refreshToken: null,
          accessToken: null,
          userId: null,
        });
      },
      updateTokens(tokens: Tokens) {
        patchState(store, {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
    }),
  ),
  withMethods(
    (
      store,
      authApi = inject(AuthApiService),
      messageService = inject(MessageService),
      router = inject(Router),
    ) => ({
      init: () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE) ?? null;
        const refreshToken =
          localStorage.getItem(REFRESH_TOKEN_STORAGE) ?? null;
        const userId = localStorage.getItem(USER_ID_STORAGE) ?? null;

        if (accessToken && refreshToken && userId) {
          patchState(store, {
            accessToken,
            refreshToken,
            userId,
            event: 'init-database',
          });
        } else {
          patchState(store, { event: 'init-local' });
        }
      },
      login: rxMethod<{ email: string; password: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ email, password }) =>
            authApi.login$(email, password).pipe(
              tapResponse({
                next: ({ tokens, user }) => {
                  messageService.add({
                    severity: 'success',
                    detail: 'You have been logged in',
                    summary: 'Success',
                  });
                  patchState(store, {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    userId: user.id,
                    loading: false,
                    event: 'auth-success',
                  });

                  store.redirect();
                },
                error: (error: ResponseError) => {
                  const errorMessage =
                    error?.error?.message || 'Error occur while logging in';
                  messageService.add({
                    severity: 'error',
                    detail: errorMessage,
                    summary: 'Error',
                  });
                  patchState(store, { error: errorMessage, loading: false });
                },
              }),
            ),
          ),
        ),
      ),
      register: rxMethod<{ email: string; password: string }>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(({ email, password }) =>
            authApi.register$(email, password).pipe(
              tapResponse({
                next: ({ tokens, user }) => {
                  messageService.add({
                    severity: 'success',
                    detail: 'You have been registered',
                    summary: 'Success',
                  });
                  patchState(store, {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    userId: user.id,
                    loading: false,
                    event: 'auth-success',
                  });

                  store.redirect();
                },
                error: (error: ResponseError) => {
                  const errorMessage =
                    error?.error?.message || 'Error occur while signing in';
                  messageService.add({
                    severity: 'error',
                    detail: errorMessage,
                    summary: 'Error',
                  });
                  patchState(store, { error: errorMessage, loading: false });
                },
              }),
            ),
          ),
        ),
      ),
      getNewTokens: rxMethod<void>(
        pipe(
          map(() => ({
            userId: store.userId(),
            refreshToken: store.refreshToken(),
          })),
          filter(({ userId, refreshToken }) => !!userId && !!refreshToken),
          switchMap(({ userId, refreshToken }) =>
            authApi.getRefreshToken$(userId!, refreshToken!).pipe(
              tapResponse({
                next: (tokens) => {
                  store.updateTokens(tokens);
                },
                error: (error: ResponseError) => {
                  const errorMessage =
                    error.error.message ??
                    'Error occur while refreshing session. Log in again!';
                  messageService.add({
                    severity: 'error',
                    detail: errorMessage,
                    summary: 'Error',
                  });
                  store.removeSession();

                  patchState(store, { error: errorMessage });
                },
              }),
            ),
          ),
        ),
      ),
      logout: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          map(() => store.userId()),
          filter((userId): userId is User['id'] => !!userId),
          switchMap((userId) =>
            authApi.logout$(userId).pipe(
              tapResponse({
                next: async () => {
                  messageService.add({
                    severity: 'success',
                    detail: 'You have been logged out',
                    summary: 'Success',
                  });
                  store.removeSession();

                  patchState(store, {
                    loading: false,
                    event: 'logout-success',
                  });

                  // TODO: redirect only if user is on protected route
                  await router.navigate(['/']);
                },
                error: async (error: ResponseError) => {
                  const errorMessage =
                    error?.error?.message || 'Error occur while logging out';
                  messageService.add({
                    severity: 'error',
                    detail: errorMessage,
                    summary: 'Error',
                  });

                  patchState(store, { loading: false, error: errorMessage });

                  await router.navigate(['/']);
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(store) {
      store.init();

      watchState(store, (state) => {
        const storageItems = {
          [REFRESH_TOKEN_STORAGE]: state.refreshToken,
          [ACCESS_TOKEN_STORAGE]: state.accessToken,
          [USER_ID_STORAGE]: state.userId,
        };

        for (const [key, value] of Object.entries(storageItems)) {
          if (value) {
            localStorage.setItem(key, value);
          } else {
            localStorage.removeItem(key);
          }
        }
      });

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE);

      if (refreshToken) {
        const { exp } = jwtDecode(refreshToken ?? '');
        const expirationTime = (exp ?? 0) * 1000 - 60000;

        if (expirationTime <= Date.now()) {
          store.logout();
        }
      }
    },
  }),
);
