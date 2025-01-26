import { computed, effect, untracked } from '@angular/core';
import { UserAddress } from '@e-commerce/shared/api-models';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { withAddress } from '@e-commerce/client-web/shared/data-access/signal-store-feature';

interface AddressState {
  selectedAddress: UserAddress | null;
}

const initialAddressState: AddressState = {
  selectedAddress: null,
};

export const AddressStore = signalStore(
  withState(initialAddressState),
  withAddress(),
  withComputed(({ selectedAddress }) => ({
    selectedAddressId: computed(() => selectedAddress()?.id ?? null),
  })),
  withMethods((store) => ({
    selectAddress: (selectedAddress: UserAddress) => {
      patchState(store, { selectedAddress });
    },
  })),
  withHooks({
    onInit: (store) => {
      effect(() => {
        const addresses = store.addresses();

        untracked(() => {
          const selectedAddress = store.selectedAddress();

          if (addresses.length === 0 || selectedAddress) return;

          store.selectAddress(addresses[0]);
        });
      });
    },
  }),
);
