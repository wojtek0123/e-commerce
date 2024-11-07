import { computed, inject } from '@angular/core';
import {
  ResponseError,
  UserAddress,
  Country,
} from '@e-commerce/client-web/shared/data-access/api-models';
import {
  CountryApiService,
  CreateUserAddressBody,
  UserAddressApiService,
} from '@e-commerce/client-web/shared/data-access/api-services';
import { tapResponse } from '@ngrx/operators';
import {
  getState,
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  entityConfig,
  removeEntity,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { debounce, filter, map, of, pipe, switchMap, tap, timer } from 'rxjs';

interface AddressState {
  loading: boolean;
  error: string | null;
  cachedAddress: UserAddress | null;
  countries: Country[];
  formInfo: {
    updatingAddress: UserAddress | null;
    type: 'add' | 'update';
    isVisible: boolean;
  };
  deleteDialogInfo: {
    isVisible: boolean;
    id: UserAddress['id'] | null;
  };
}

const initialAddressState: AddressState = {
  loading: false,
  error: null,
  cachedAddress: null,
  countries: [],
  formInfo: {
    updatingAddress: null,
    type: 'add',
    isVisible: false,
  },
  deleteDialogInfo: {
    isVisible: false,
    id: null,
  },
};

const addressesConfig = entityConfig({
  entity: type<UserAddress>(),
  collection: '_addresses',
  selectId: (address) => address.id,
});

export function withAddress() {
  return signalStoreFeature(
    withState(initialAddressState),
    withEntities(addressesConfig),
    withComputed(({ _addressesEntities, formInfo, deleteDialogInfo }) => ({
      addresses: computed(() => _addressesEntities()),
      updatingAddress: computed(() => formInfo().updatingAddress),
      formType: computed(() => formInfo().type),
      formVisibility: computed(() => formInfo().isVisible),
      isDeleteDialogVisible: computed(() => deleteDialogInfo().isVisible),
    })),
    withMethods(
      (
        store,
        userAddressApi = inject(UserAddressApiService),
        countryApi = inject(CountryApiService),
        messageService = inject(MessageService),
      ) => ({
        getAddresses$: rxMethod<void>(
          pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() =>
              userAddressApi.getAll$().pipe(
                tapResponse({
                  next: (addresses) => {
                    patchState(
                      store,
                      {
                        loading: false,
                        formInfo: {
                          updatingAddress: null,
                          type: 'add',
                          isVisible: addresses.length === 0,
                        },
                      },
                      addEntities(addresses, addressesConfig),
                    );
                  },
                  error: (error: ResponseError) => {
                    patchState(store, {
                      error:
                        error?.error?.message ||
                        'Error occur while getting addresses',
                      loading: false,
                    });
                  },
                }),
              ),
            ),
          ),
        ),
        getCountries$: rxMethod<{ name: string }>(
          pipe(
            debounce(({ name }) => (name.length === 0 ? of({}) : timer(300))),
            switchMap(({ name }) =>
              countryApi.getAll$({ nameLike: name }).pipe(
                tapResponse({
                  next: (countries) => {
                    patchState(store, { countries });
                  },
                  error: (error: ResponseError) => {
                    messageService.add({
                      summary: 'Error',
                      detail:
                        error?.error?.message ||
                        'Error occur while getting countries',
                      severity: 'error',
                    });
                  },
                }),
              ),
            ),
          ),
        ),
        addAddress$: rxMethod<{ data: CreateUserAddressBody }>(
          pipe(
            tap(() => {
              patchState(store, { loading: true });
            }),
            switchMap(({ data }) =>
              userAddressApi.create$(data).pipe(
                tapResponse({
                  next: (userAddress) => {
                    patchState(
                      store,
                      (state) => ({
                        loading: false,
                        formInfo: {
                          ...state.formInfo,
                          updatingAddress: null,
                          isVisible: false,
                        },
                      }),
                      addEntity(userAddress, addressesConfig),
                    );
                    messageService.add({
                      summary: 'Success',
                      detail: 'Saved address',
                      severity: 'success',
                    });
                  },
                  error: (error: ResponseError) => {
                    patchState(store, { loading: false });
                    const errorMessage =
                      error?.error?.message ??
                      'Error occur while creating user address';

                    messageService.add({
                      summary: 'Error',
                      detail: errorMessage,
                      severity: 'error',
                    });
                  },
                }),
              ),
            ),
          ),
        ),
        updateAddress$: rxMethod<{
          data: CreateUserAddressBody;
        }>(
          pipe(
            tap({
              next: ({ data }) => {
                const id = store.updatingAddress()?.id ?? '';
                console.log(id);
                patchState(
                  store,
                  (state) => ({
                    cachedAddress: state._addressesEntityMap[id],
                    formInfo: {
                      ...state.formInfo,
                      isVisible: false,
                    },
                  }),
                  updateEntity(
                    {
                      id,
                      changes: {
                        ...data,
                      },
                    },
                    addressesConfig,
                  ),
                );
              },
            }),
            map(({ data }) => {
              const id = store.updatingAddress()?.id;
              if (!id) {
                // Handle the absence of `id` appropriately
                throw new Error('No address ID available for update.');
              }
              return { data, id };
            }),
            switchMap(({ data, id }) =>
              userAddressApi.update$(id, { ...data }).pipe(
                tapResponse({
                  next: () => {
                    patchState(store, (state) => ({
                      cachedAddress: null,
                      formInfo: {
                        ...state.formInfo,
                        updatingAddress: null,
                      },
                    }));

                    messageService.add({
                      summary: 'Success',
                      detail: 'Updated address',
                      severity: 'success',
                    });
                  },
                  error: (error: ResponseError) => {
                    const cachedAddress = store.cachedAddress();

                    if (cachedAddress) {
                      patchState(
                        store,
                        { cachedAddress: null },
                        setEntity(cachedAddress, addressesConfig),
                      );
                    }

                    messageService.add({
                      summary: 'Error',
                      detail:
                        error?.error?.message || 'Error occur while updating',
                      severity: 'error',
                    });
                  },
                }),
              ),
            ),
          ),
        ),
        deleteAddress$: rxMethod<void>(
          pipe(
            map(() => getState(store).deleteDialogInfo.id),
            filter((id): id is UserAddress['id'] => !!id),
            tap((id) => {
              const address = store._addressesEntityMap()[id];

              patchState(store, removeEntity(id, addressesConfig), {
                cachedAddress: address,
              });
            }),
            switchMap((id) =>
              userAddressApi.delete$(id).pipe(
                tapResponse({
                  next: () => {
                    patchState(store, {
                      cachedAddress: null,
                      deleteDialogInfo: {
                        id: null,
                        isVisible: false,
                      },
                    });
                  },
                  error: (error: ResponseError) => {
                    const cachedAddress = store.cachedAddress();

                    if (cachedAddress) {
                      patchState(
                        store,
                        {
                          deleteDialogInfo: {
                            id: null,
                            isVisible: false,
                          },
                        },
                        addEntity(cachedAddress, addressesConfig),
                      );
                    }
                    messageService.add({
                      summary: 'Error',
                      detail:
                        error?.error?.message ??
                        'An error occur while deleting address',
                      severity: 'error',
                    });
                  },
                }),
              ),
            ),
          ),
        ),
        showForm: (address?: UserAddress) => {
          patchState(store, {
            formInfo: {
              updatingAddress: address ?? null,
              type: address ? 'update' : 'add',
              isVisible: true,
            },
          });
        },
        hideForm: () => {
          patchState(store, (state) => ({
            formInfo: {
              ...state.formInfo,
              updatingAddress: null,
              isVisible: false,
            },
          }));
        },
        showDeleteDialog: (id: UserAddress['id']) => {
          patchState(store, {
            deleteDialogInfo: {
              isVisible: true,
              id,
            },
          });
        },
        hideDeleteDialog: () => {
          patchState(store, {
            deleteDialogInfo: {
              isVisible: false,
              id: null,
            },
          });
        },
        resetState: () => {
          patchState(store, initialAddressState);
        },
      }),
    ),
    withHooks({
      onInit: (store) => {
        store.getAddresses$();
      },
    }),
  );
}