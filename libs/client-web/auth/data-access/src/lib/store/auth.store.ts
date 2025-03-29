import {
  patchState,
  signalStore,
  withMethods,
  withState,
  withHooks,
  withComputed,
  watchState,
  withProps,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AuthApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { ResponseError, Tokens, User } from '@e-commerce/shared/api-models';
import {
  afterNextRender,
  computed,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { AsyncSubject, filter, map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  APP_ROUTE_PATHS_TOKEN,
  APP_LOCAL_STORAGE_KEYS_TOKEN,
  APP_QUERY_PARAMS,
  APP_ROUTES_FEATURE,
} from '@e-commerce/client-web/shared/app-config';
import { MessageBusService } from '@e-commerce/client-web/shared/data-access/services';
import { Location } from '@angular/common';

export interface AuthState {
  userId: User['id'] | null;
  accessToken: Tokens['accessToken'] | null;
  refreshToken: Tokens['refreshToken'] | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  userId: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthState),
  withComputed(({ userId, accessToken, refreshToken }) => ({
    isAuthenticated: computed(
      () => !!userId() && !!accessToken() && !!refreshToken(),
    ),
  })),
  withProps(() => ({
    _messageBusService: inject(MessageBusService),
    _router: inject(Router),
    _location: inject(Location),
    _appRoutePaths: inject(APP_ROUTE_PATHS_TOKEN),
  })),
  withMethods((store, route = inject(ActivatedRoute)) => ({
    redirect: async () => {
      const url = route.snapshot.queryParams[APP_QUERY_PARAMS.REDIRECT_TO] as
        | string
        | undefined;
      const state = store._location.getState() as { navigationId?: number };

      const appRoutePath = {
        'order-process': store._appRoutePaths.ORDER_PROCESS(),
      }[url ?? ''];

      if (state.navigationId === 1 || appRoutePath) {
        await store._router.navigate([
          appRoutePath || store._appRoutePaths.HOME(),
        ]);
      } else {
        store._location.back();
      }
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
  })),
  withMethods(
    (
      store,
      authApi = inject(AuthApiService),
      messageService = inject(MessageService),
      router = inject(Router),
      appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN),
      appLocalStorageKeys = inject(APP_LOCAL_STORAGE_KEYS_TOKEN),
      injector = inject(Injector),
    ) => ({
      init: () => {
        runInInjectionContext(injector, () => {
          afterNextRender(() => {
            const accessToken =
              localStorage.getItem(appLocalStorageKeys.ACCESS_TOKEN) ?? null;
            const refreshToken =
              localStorage.getItem(appLocalStorageKeys.REFRESH_TOKEN) ?? null;
            const userId =
              localStorage.getItem(appLocalStorageKeys.USER_ID) ?? null;

            if (accessToken && refreshToken && userId) {
              patchState(store, {
                accessToken,
                refreshToken,
                userId,
              });

              store._messageBusService.setEvent('init-database');
            } else {
              store._messageBusService.setEvent('init-local');
            }
          });
        });
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
                  });
                  store._messageBusService.setEvent('auth-success');

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
                  });
                  store._messageBusService.setEvent('auth-success');

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
      removeLocalSession: () => {
        store.removeSession();

        patchState(store, {
          loading: false,
        });

        store._messageBusService.setEvent('logout-success');
      },
      logout: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          map(() => store.userId()),
          filter((userId): userId is User['id'] => !!userId),
          switchMap((userId) =>
            authApi.logout$(userId).pipe(
              tapResponse({
                next: async () => {
                  const currectUrl = store._router.url;

                  const mainRoutePath = currectUrl.split('/').at(1);

                  const notRestrictedRoutes = [
                    APP_ROUTES_FEATURE.HOME.BASE,
                    APP_ROUTES_FEATURE.BROWSE.BASE,
                  ] as string[];

                  if (!notRestrictedRoutes.includes(mainRoutePath ?? '')) {
                    await router.navigate([appRoutePaths.HOME()]);
                  }

                  messageService.add({
                    severity: 'success',
                    detail: 'You have been logged out',
                    summary: 'Success',
                  });
                  store.removeSession();

                  patchState(store, {
                    loading: false,
                  });

                  store._messageBusService.setEvent('logout-success');
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

                  await router.navigate([appRoutePaths.HOME()]);
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(
      store,
      appLocalStorageKeys = inject(APP_LOCAL_STORAGE_KEYS_TOKEN),
      injector = inject(Injector),
    ) {
      store.init();

      runInInjectionContext(injector, () => {
        afterNextRender(() => {
          watchState(
            store,
            (state) => {
              const storageItems = {
                [appLocalStorageKeys.REFRESH_TOKEN]: state.refreshToken,
                [appLocalStorageKeys.ACCESS_TOKEN]: state.accessToken,
                [appLocalStorageKeys.USER_ID]: state.userId,
              };

              for (const [key, value] of Object.entries(storageItems)) {
                if (value) {
                  localStorage.setItem(key, value);
                } else {
                  localStorage.removeItem(key);
                }
              }
            },
            { injector },
          );

          const refreshToken = localStorage.getItem(
            appLocalStorageKeys.REFRESH_TOKEN,
          );

          if (refreshToken) {
            const { exp } = jwtDecode(refreshToken ?? '');
            const expirationTime = (exp ?? 0) * 1000 - 60000;

            if (expirationTime <= Date.now()) {
              store.logout();
            }
          }
        });
      });
    },
  }),
);
