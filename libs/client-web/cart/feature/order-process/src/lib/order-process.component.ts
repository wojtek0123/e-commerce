import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web/cart/ui';
import { Book, CartItem } from '@e-commerce/client-web/shared/data-access';
import { CurrencyPipe, NgClass } from '@angular/common';
import { SummaryComponent } from './summary/summary.component';
import { Store } from '@ngrx/store';
import {
  cartActions,
  cartSelectors,
} from '@e-commerce/client-web/cart/data-access';

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
  private readonly store = inject(Store);

  cartItems = this.store.selectSignal(cartSelectors.selectCartItems);
  cartItemsLoading = this.store.selectSignal(cartSelectors.selectLoading);
  total = this.store.selectSignal(cartSelectors.selectTotal);

  updateQuantity(cartItem: { quantity: CartItem['quantity']; book: Book }) {
    this.store.dispatch(cartActions.updateQuantity({ ...cartItem }));
  }

  remove(arg: { bookId: Book['id'] }) {
    this.store.dispatch(cartActions.removeBookFromCart({ ...arg }));
  }
}
