import {
  CartItemBase,
  ShoppingSession,
} from '@e-commerce/client-web/shared/data-access';

export interface CartState {
  shoppingSession: ShoppingSession | null;
  shoppingSessionId: ShoppingSession['id'] | null;
  cartItems: CartItemBase[];
  loading: boolean;
  error: string | string[] | null;
}

export const initialCartState: CartState = {
  shoppingSession: null,
  shoppingSessionId: null,
  cartItems: [],
  loading: false,
  error: null,
};
