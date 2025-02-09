import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web/cart/ui';
import { Book, CartItemBase } from '@e-commerce/shared/api-models';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-cart-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CartItemComponent, CartItemSkeletonComponent, RouterLink],
  templateUrl: './cart-items.component.html',
})
export class CartItemsComponent {
  #cartStore = inject(CartStore);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  cartItems = this.#cartStore.cartItems;
  cartItemsLoading = this.#cartStore.loading;
  total = this.#cartStore.total;

  booksUrl = this.#appRoutePaths.BOOKS();

  updateQuantity(quantity: CartItemBase['quantity'], bookId: Book['id']) {
    this.#cartStore.updateQuantity({ bookId, quantity });
  }

  remove(bookId: Book['id']) {
    this.#cartStore.removeBook({ bookId });
  }
}
