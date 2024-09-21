import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web/cart/ui';
import { Store } from '@ngrx/store';
import {
  cartActions,
  cartSelectors,
} from '@e-commerce/client-web/cart/data-access';
import { Book } from '@e-commerce/client-web/shared/data-access';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'lib-cart-sidebar',
  standalone: true,
  imports: [
    NgClass,
    SidebarModule,
    ButtonModule,
    TooltipModule,
    AsyncPipe,
    InputNumberModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    CartItemComponent,
    CartItemSkeletonComponent,
    BadgeModule,
    CurrencyPipe,
  ],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSidebarComponent {
  private readonly store = inject(Store);

  public isLabelShowed = input<boolean>(false);

  public cartItems = this.store.selectSignal(cartSelectors.selectCartItems);
  public count = this.store.selectSignal(cartSelectors.selectCount);
  public total = this.store.selectSignal(cartSelectors.selectTotal);
  public loading = this.store.selectSignal(cartSelectors.selectLoading);
  public error = this.store.selectSignal(cartSelectors.selectError);

  public visible = signal(false);
  // public skeletons = signal(new Array(5));

  updateQuantity(args: { book: Book; quantity: number }) {
    this.store.dispatch(cartActions.updateQuantity({ ...args }));
  }

  remove(args: { bookId: Book['id'] }) {
    this.store.dispatch(cartActions.removeBookFromCart({ ...args }));
  }

  checkout() {
    this.visible.set(false);
    this.store.dispatch(cartActions.checkout());
  }
}
