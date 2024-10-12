import { computed, inject } from '@angular/core';
import {
  CountryApiService,
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
}

const initialAddressState: AddressState = {
  selectedAddress: null,
  loading: false,
  error: null,
  cachedAddress: null,
  countries: [],
};

const addressesConfig = entityConfig({
  entity: type<UserAddress>(),
  collection: '_addresses',
  selectId: (address) => address.id,
});

export const AddressStore = signalStore(
  withState(initialAddressState),
  withEntities(addressesConfig),
  withComputed(({ _addressesEntities }) => ({
    addresses: computed(() => _addressesEntities()),
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
                    { loading: false },
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
      updateAddress: rxMethod<{
        id: UserAddress['id'];
        data: Partial<Omit<UserAddress, 'id'>>;
      }>(
        pipe(
          tap({
            next: ({ id, data }) => {
              patchState(
                store,
                (state) => ({
                  cachedAddress: state._addressesEntityMap[id],
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
          switchMap(({ id, data }) =>
            userAddressApi.update$(id, { ...data }).pipe(
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
    }),
  ),
  withHooks({
    onInit: (store) => {
      store.getAddresses();
    },
  }),
);
