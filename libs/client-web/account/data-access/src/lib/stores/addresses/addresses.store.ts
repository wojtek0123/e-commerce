import { computed, inject } from '@angular/core';
import {
  CountryApiService,
  CreateUserAddressBody,
  UserAddressApiService,
} from '@e-commerce/client-web/shared/data-access/api-services';
import {
  Country,
  UserAddress,
  ResponseError,
} from '@e-commerce/client-web/shared/data-access/api-models';
import { tapResponse } from '@ngrx/operators';
import {
  getState,
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
  removeEntity,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { debounce, filter, map, of, pipe, switchMap, tap, timer } from 'rxjs';
import { User } from '@prisma/client';

interface AddressState {
  selectedAddress: UserAddress | null;
  loading: boolean;
  error: string | null;
  cachedAddress: UserAddress | null;
  countries: Country[];
  formInfo: {
    selectedAddress: UserAddress | null;
    type: 'add' | 'update' | 'delete';
    isVisible: boolean;
  };
}

type FormType = 'add' | 'update' | 'delete';

const initialAddressState: AddressState = {
  selectedAddress: null,
  loading: false,
  error: null,
  cachedAddress: null,
  countries: [],
  formInfo: {
    selectedAddress: null,
    type: 'add',
    isVisible: false,
  },
};

const addressesConfig = entityConfig({
  entity: type<UserAddress>(),
  collection: '_addresses',
  selectId: (address) => address.id,
});

// TODO: Create signal store feature to not duplicate address store login in two places or something else to not duplicate code
export const AddressStore = signalStore(
  withState(initialAddressState),
  withEntities(addressesConfig),
  withComputed(({ _addressesEntities, formInfo, selectedAddress }) => ({
    addresses: computed(() => _addressesEntities()),
    updatingAddress: computed(() => formInfo().selectedAddress),
    formType: computed(() => formInfo().type),
    formVisibility: computed(() => formInfo().isVisible),
    selectedAddressId: computed(() => selectedAddress()?.id ?? null),
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
                        selectedAddress: null,
                        type: 'add',
                        isVisible: false,
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
                        selectedAddress: null,
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
                      selectedAddress: null,
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
          map(() => getState(store).formInfo.selectedAddress?.id),
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
                  patchState(store, (state) => ({
                    cachedAddress: null,
                    formInfo: {
                      ...state.formInfo,
                      selectedAddress: null,
                      isVisible: false,
                    },
                  }));
                },
                error: (error: ResponseError) => {
                  const cachedAddress = store.cachedAddress();

                  if (cachedAddress) {
                    patchState(
                      store,
                      (state) => ({
                        formInfo: {
                          ...state.formInfo,
                          selectedAddress: null,
                          isVisible: false,
                        },
                      }),
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
      selectAddress: (selectedAddress: UserAddress) => {
        patchState(store, { selectedAddress });
      },
      showForm: (type: FormType, selectedAddress?: UserAddress) => {
        patchState(store, {
          formInfo: {
            selectedAddress: selectedAddress ?? null,
            type,
            isVisible: true,
          },
        });
      },
      hideForm: () => {
        patchState(store, (state) => ({
          formInfo: {
            ...state.formInfo,
            selectedAddress: null,
            isVisible: false,
          },
        }));
      },
    }),
  ),
  withHooks({
    onInit: (store) => {
      store.getAddresses$();
    },
  }),
);
