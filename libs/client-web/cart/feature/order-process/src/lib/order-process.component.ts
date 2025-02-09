import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web/cart/ui';
import { Book, CartItemBase } from '@e-commerce/shared/api-models';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { SummaryComponent } from './components/summary/summary.component';
import { NgClass } from '@angular/common';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

@Component({
  selector: 'lib-order-process',
  imports: [
    StepsModule,
    ToastModule,
    ButtonModule,
    CartItemComponent,
    NgClass,
    CartItemSkeletonComponent,
    SummaryComponent,
    RouterLink,
  ],
  templateUrl: './order-process.component.html',
  styleUrl: './order-process.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProcessComponent {
  #cartStore = inject(CartStore);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  booksUrl = this.#appRoutePaths.BOOKS();

  cartItems = this.#cartStore.cartItems;
  cartItemsLoading = this.#cartStore.loading;
  total = this.#cartStore.total;

  updateQuantity(quantity: CartItemBase['quantity'], bookId: Book['id']) {
    this.#cartStore.updateQuantity({ bookId, quantity });
  }

  remove(bookId: Book['id']) {
    this.#cartStore.removeBook({ bookId });
  }
}
