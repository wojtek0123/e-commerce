import { ResponseError, User } from '@e-commerce/shared/api-models';
import {
  UserApiService,
  UpdateUserBody,
} from '@e-commerce/client-web/shared/data-access/api-services';
import {
  getState,
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

interface CustomerInformationState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isFormVisible: boolean;
}

const initialCustomerInformationState: CustomerInformationState = {
  user: null,
  loading: false,
  error: null,
  isFormVisible: false,
};

export const CustomerInformationStore = signalStore(
  withState(initialCustomerInformationState),
  withComputed(({ user }) => ({
    email: computed(() => user()?.email),
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
                    isFormVisible: false,
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
      showForm: () => {
        patchState(store, { isFormVisible: true });
      },
      hideForm: () => {
        patchState(store, { isFormVisible: false });
      },
    }),
  ),
);
