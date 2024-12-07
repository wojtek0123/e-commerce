import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
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
import { Book } from '@e-commerce/client-web/shared/data-access/api-models';
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
  private readonly cartStore = inject(CartStore);
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  public isLabelShowed = input<boolean>(false);

  public cartItems = this.cartStore.cartItems;
  public count = this.cartStore.itemsCount;
  public total = this.cartStore.total;
  public loading = this.cartStore.loading;
  public error = this.cartStore.error;

  public visible = signal(false);

  public updateQuantity({ book, quantity }: { book: Book; quantity: number }) {
    this.cartStore.updateQuantity({ bookId: book.id, quantity });
  }

  public remove(args: { bookId: Book['id'] }) {
    this.cartStore.removeBook(args);
  }
}
