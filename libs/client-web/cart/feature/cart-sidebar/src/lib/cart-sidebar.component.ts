import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CartItemComponent } from '@e-commerce/client-web/cart/ui';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import { Book, CartItemBase } from '@e-commerce/shared/api-models';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DrawerModule } from 'primeng/drawer';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { DrawerLeftDirective } from '@e-commerce/client-web/shared/utils';

@Component({
  selector: 'lib-cart-sidebar',
  standalone: true,
  imports: [
    NgClass,
    DrawerModule,
    ButtonModule,
    TooltipModule,
    InputNumberModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    CartItemComponent,
    OverlayBadgeModule,
    CurrencyPipe,
    DrawerLeftDirective,
  ],
  templateUrl: './cart-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSidebarComponent {
  #cartStore = inject(CartStore);

  appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  isLabelShowed = input<boolean>(false);

  cartItems = this.#cartStore.cartItems;
  count = this.#cartStore.itemsCount;
  total = this.#cartStore.total;
  loading = this.#cartStore.loading;
  error = this.#cartStore.error;
  visible = this.#cartStore.isDrawerVisible;

  updateQuantity(quantity: CartItemBase['quantity'], bookId: Book['id']) {
    this.#cartStore.updateQuantity({ bookId, quantity });
  }

  remove(bookId: Book['id']) {
    this.#cartStore.removeBook({ bookId });
  }

  openDrawer() {
    this.#cartStore.openDrawerCart();
  }

  closeDrawer() {
    this.#cartStore.closeDrawerCart();
  }
}
