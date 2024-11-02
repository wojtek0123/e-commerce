import { signalStore } from '@ngrx/signals';
import { withAddress } from '@e-commerce/client-web/shared/data-access/signal-store-feature';

export const AddressStore = signalStore(withAddress());
