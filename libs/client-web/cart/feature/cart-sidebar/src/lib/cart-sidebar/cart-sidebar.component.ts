import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { Router, RouterLink } from '@angular/router';
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
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NavButtonDirective } from '@e-commerce/client-web/shared/utils';
import { DrawerModule } from 'primeng/drawer';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'lib-cart-sidebar',
  standalone: true,
  imports: [
    NgClass,
    DrawerModule,
    ButtonModule,
    TooltipModule,
    AsyncPipe,
    InputNumberModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    CartItemComponent,
    CartItemSkeletonComponent,
    OverlayBadgeModule,
    CurrencyPipe,
    NavButtonDirective,
    SidebarModule,
  ],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSidebarComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  public isLabelShowed = input<boolean>(false);

  public cartItems = this.store.selectSignal(cartSelectors.selectCartItems);
  public count = this.store.selectSignal(cartSelectors.selectCount);
  public total = this.store.selectSignal(cartSelectors.selectTotal);
  public loading = this.store.selectSignal(cartSelectors.selectLoading);
  public error = this.store.selectSignal(cartSelectors.selectError);

  public visible = signal(false);

  updateQuantity(args: { book: Book; quantity: number }) {
    this.store.dispatch(cartActions.updateQuantity({ ...args }));
  }

  remove(args: { bookId: Book['id'] }) {
    this.store.dispatch(cartActions.removeBookFromCart({ ...args }));
  }

  async checkout() {
    this.visible.set(false);
    // this.store.dispatch(cartActions.checkout());
    await this.router.navigate(['/order-process']);
  }
}
