import { computed, effect, untracked } from '@angular/core';
import { UserAddress } from '@e-commerce/client-web/shared/data-access/api-models';
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
      // TODO: can i do this better?
      effect(() => {
        const addresses = store.addresses();

        untracked(() => {
          if (addresses.length === 0) return;

          store.selectAddress(addresses[0]);
        });
      });
    },
  }),
);
