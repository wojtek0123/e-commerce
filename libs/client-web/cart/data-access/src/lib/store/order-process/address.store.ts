import { computed, inject } from '@angular/core';
import {
  CountryApiService,
  CreateUserAddressBody,
  ResponseError,
  UserAddress,
  UserAddressApiService,
} from '@e-commerce/client-web/shared/data-access';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
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
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Country } from '@prisma/client';
import { MessageService } from 'primeng/api';
import { pipe, switchMap, tap } from 'rxjs';

interface AddressState {
  selectedAddress: UserAddress | null;
  loading: boolean;
  error: string | null;
  cachedAddress: UserAddress | null;
  countries: Country[];
  formInfo: {
    updatingAddress: UserAddress | null;
    type: 'add' | 'update';
    visibility: boolean;
  };
}

const initialAddressState: AddressState = {
  selectedAddress: null,
  loading: false,
  error: null,
  cachedAddress: null,
  countries: [],
  formInfo: {
    updatingAddress: null,
    type: 'add',
    visibility: false,
  },
};

const addressesConfig = entityConfig({
  entity: type<UserAddress>(),
  collection: '_addresses',
  selectId: (address) => address.id,
});

export const AddressStore = signalStore(
  withState(initialAddressState),
  withEntities(addressesConfig),
  withComputed(({ _addressesEntities, formInfo }) => ({
    addresses: computed(() => _addressesEntities()),
    updatingAddress: computed(() => formInfo().updatingAddress),
    formType: computed(() => formInfo().type),
    formVisibility: computed(() => formInfo().visibility),
  })),
  withMethods(
    (
      store,
      userAddressApi = inject(UserAddressApiService),
      countryApi = inject(CountryApiService),
      messageService = inject(MessageService),
    ) => ({
      getAddresses: rxMethod<void>(
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
                        visibility: addresses.length === 0,
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
      getCountries: rxMethod<{ name: string }>(
        pipe(
          switchMap(({ name }) =>
            countryApi.getAll().pipe(
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
                        visibility: false,
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
                    updatingAddress: null,
                    visibility: false,
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
          switchMap(({ data }) =>
            userAddressApi
              .update$(store.updatingAddress()?.id ?? '', { ...data })
              .pipe(
                tapResponse({
                  next: () => {
                    patchState(store, {
                      cachedAddress: null,
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
      selectAddress: (selectedAddress: UserAddress) => {
        patchState(store, { selectedAddress });
      },
      showForm: (address?: UserAddress) => {
        patchState(store, {
          formInfo: {
            updatingAddress: address ?? null,
            type: address ? 'update' : 'add',
            visibility: true,
          },
        });
      },
      hideForm: () => {
        patchState(store, (state) => ({
          formInfo: {
            ...state.formInfo,
            updatingAddress: null,
            visibility: false,
          },
        }));
      },
    }),
  ),
  withHooks({
    onInit: (store) => {
      store.getAddresses();
    },
  }),
);
