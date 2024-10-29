import {
  ResponseError,
  User,
} from '@e-commerce/client-web/shared/data-access/api-models';
import {
  UserApiService,
  UpdateUserBody,
} from '@e-commerce/client-web/shared/data-access/api-services';
import {
  getState,
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { MessageService } from 'primeng/api';

interface InformationState {
  user: User | null;
  loading: boolean;
  error: string | null;
  editingField: EditingField;
}

const initialInformationState: InformationState = {
  user: null,
  loading: false,
  error: null,
  editingField: null,
};

export type EditingField = 'email' | 'password' | null;

export const InformationStore = signalStore(
  withState(initialInformationState),
  withMethods(
    (
      store,
      userApi = inject(UserApiService),
      messageService = inject(MessageService),
    ) => ({
      getUser$: rxMethod<{ id: User['id'] }>(
        pipe(
          tap(() =>
            patchState(store, {
              loading: true,
            }),
          ),
          switchMap(({ id }) =>
            userApi.get$(id).pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, {
                    user,
                    loading: false,
                  });
                },
                error: (error: ResponseError) => {
                  patchState(store, {
                    error:
                      error?.error?.message ??
                      'An error occurred while getting account information',
                    loading: false,
                  });
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
          map(({ body }) => ({
            body,
            id: getState(store).user?.id ?? '',
          })),
          filter(({ id }) => !!id),
          tap(() => patchState(store, { loading: true })),
          switchMap(({ id, body }) =>
            userApi.update$(id, body).pipe(
              tapResponse({
                next: (user) => {
                  patchState(store, {
                    user,
                    loading: false,
                    editingField: null,
                  });
                  messageService.add({
                    summary: 'Success',
                    detail: 'Updated information',
                    severity: 'success',
                  });
                },
                error: (error: ResponseError) => {
                  patchState(store, { loading: false });
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
        patchState(store, { editingField });
      },
    }),
  ),
);
