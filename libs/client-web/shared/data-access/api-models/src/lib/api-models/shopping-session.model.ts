import { CartItem } from './cart-item.model';

export interface ShoppingSession {
  id: string;
  createdAt: string;
  udpatedAt: string;
  total: number;
  cartItems: CartItem[];
  userId: number;
}
