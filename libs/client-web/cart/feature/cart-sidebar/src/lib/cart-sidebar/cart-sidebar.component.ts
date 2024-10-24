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
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web/cart/ui';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
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
  private readonly cartStore = inject(CartStore);

  public isLabelShowed = input<boolean>(false);

  public cartItems = this.cartStore.cartItems;
  public count = this.cartStore.itemsCount;
  public total = this.cartStore.total;
  public loading = this.cartStore.loading;
  public error = this.cartStore.error;

  public visible = signal(false);

  updateQuantity({ book, quantity }: { book: Book; quantity: number }) {
    this.cartStore.updateQuantity({ bookId: book.id, quantity });
  }

  remove(args: { bookId: Book['id'] }) {
    this.cartStore.removeBook(args);
  }
}
