import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web/cart/ui';
import {
  Book,
  CartItem,
} from '@e-commerce/client-web/shared/data-access/api-models';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { SummaryComponent } from './components/summary/summary.component';
import { NgClass } from '@angular/common';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

@Component({
  selector: 'lib-order-process',
  standalone: true,
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
  private readonly cartStore = inject(CartStore);
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  public cartItems = this.cartStore.cartItems;
  public cartItemsLoading = this.cartStore.loading;
  public total = this.cartStore.total;

  public updateQuantity({
    book,
    quantity,
  }: {
    quantity: CartItem['quantity'];
    book: Book;
  }) {
    this.cartStore.updateQuantity({ bookId: book.id, quantity });
  }

  public remove(arg: { bookId: Book['id'] }) {
    this.cartStore.removeBook(arg);
  }
}
