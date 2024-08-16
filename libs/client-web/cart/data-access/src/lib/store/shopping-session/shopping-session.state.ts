import { ShoppingSession } from '@e-commerce/client-web/shared/data-access';

export interface ShoppingSessionState {
  shoppingSession: ShoppingSession | null;
  shoppingSessionId: ShoppingSession['id'] | null;
}

export const initialShoppingSessionState: ShoppingSessionState = {
  shoppingSession: null,
  shoppingSessionId: null,
};
