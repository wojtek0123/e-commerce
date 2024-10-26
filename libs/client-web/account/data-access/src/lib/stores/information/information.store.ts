import {
  ResponseError,
  UpdateUserBody,
  User,
  UserApiService,
} from '@e-commerce/client-web/shared/data-access';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { MessageService } from 'primeng/api';

interface InformationState {
  account: {
    user: User | null;
    loading: boolean;
    error: string | null;
    editingField: EditingField;
  };
}

const initialInformationState: InformationState = {
  account: {
    user: null,
    loading: false,
    error: null,
    editingField: null,
  },
};

export type EditingField = 'email' | 'password' | null;

export const InformationStore = signalStore(
  withState(initialInformationState),
  withComputed(({ account }) => ({
    user: computed(() => account().user),
    userLoading: computed(() => account().loading),
    userError: computed(() => account().error),
    userEditingField: computed(() => account().editingField),
  })),
  withMethods(
    (
      store,
      userApi = inject(UserApiService),
      messageService = inject(MessageService),
    ) => ({
      getUser$: rxMethod<{ id: User['id'] }>(
        pipe(
          tap(() =>
            patchState(store, (state) => ({
              account: { ...state.account, loading: true },
            })),
          ),
          switchMap(({ id }) =>
            userApi.get$(id).pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, (state) => ({
                    account: { ...state.account, user, loading: false },
                  }));
                },
                error: (error: ResponseError) => {
                  patchState(store, (state) => ({
                    account: {
                      ...state.account,
                      error:
                        error?.error?.message ??
                        'An error occurred while getting account information',
                      loading: false,
                    },
                  }));
                },
              }),
            ),
          ),
        ),
      ),
      updateUser$: rxMethod<{
        body: UpdateUserBody;
      }>(
        pipe(
          tap(() =>
            patchState(store, (state) => ({
              account: { ...state.account, loading: true },
            })),
          ),
          map(({ body }) => ({
            body,
            id: store.user()?.id ?? '',
          })),
          filter(({ id }) => !!id),
          switchMap(({ id, body }) =>
            userApi.update$(id, body).pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, (state) => ({
                    account: {
                      ...state.account,
                      user,
                      loading: false,
                      editingField: null,
                    },
                  }));
                  messageService.add({
                    summary: 'Success',
                    detail: 'Updated information',
                    severity: 'success',
                  });
                },
                error: (error: ResponseError) => {
                  patchState(store, (state) => ({
                    account: {
                      ...state.account,
                      loading: false,
                    },
                  }));
                  messageService.add({
                    summary: 'Error',
                    detail:
                      error?.error?.message ??
                      'An error occurred while updating user information',
                    severity: 'error',
                  });
                },
              }),
            ),
          ),
        ),
      ),
      setEditingField(editingField: EditingField) {
        patchState(store, (state) => ({
          account: { ...state.account, editingField },
        }));
      },
    }),
  ),
);
