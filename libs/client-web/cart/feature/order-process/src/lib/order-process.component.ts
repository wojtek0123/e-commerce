import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web/cart/ui';
import { Book, CartItem } from '@e-commerce/client-web/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { SummaryComponent } from './components/summary/summary.component';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'lib-order-process',
  standalone: true,
  imports: [
    StepsModule,
    ToastModule,
    RouterOutlet,
    ButtonModule,
    CartItemComponent,
    NgClass,
    CurrencyPipe,
    CartItemSkeletonComponent,
    SummaryComponent,
  ],
  templateUrl: './order-process.component.html',
  styleUrl: './order-process.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProcessComponent {
  private readonly cartStore = inject(CartStore);

  public cartItems = this.cartStore.cartItems;
  public cartItemsLoading = this.cartStore.loading;
  public total = this.cartStore.total;

  updateQuantity({
    book,
    quantity,
  }: {
    quantity: CartItem['quantity'];
    book: Book;
  }) {
    this.cartStore.updateQuantity({ bookId: book.id, quantity });
  }

  remove(arg: { bookId: Book['id'] }) {
    this.cartStore.removeBook(arg);
  }
}
