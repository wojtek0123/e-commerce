import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import {
  CartItemComponent,
  CartItemsComponent,
} from '@e-commerce/client-web/cart/ui';
import { Book, CartItemBase } from '@e-commerce/shared/api-models';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { ErrorAndRetryMessageComponent } from '@e-commerce/client-web/shared/ui';

@Component({
  selector: 'lib-order-cart-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CartItemsComponent,
    CartItemComponent,
    ErrorAndRetryMessageComponent,
  ],
  templateUrl: './order-cart-items.component.html',
})
export class OrderCartItemsComponent {
  #cartStore = inject(CartStore);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  cartItems = this.#cartStore.cartItems;
  loading = this.#cartStore.loading;
  error = this.#cartStore.error;
  total = this.#cartStore.total;

  booksUrl = this.#appRoutePaths.BOOKS();

  updateQuantity(quantity: CartItemBase['quantity'], bookId: Book['id']) {
    this.#cartStore.updateQuantity({ bookId, quantity });
  }

  remove(bookId: Book['id']) {
    this.#cartStore.removeBook({ bookId });
  }

  getCartItems() {
    this.#cartStore.getShoppingSession();
  }
}
