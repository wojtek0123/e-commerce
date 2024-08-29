import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { Book, CartItem } from '@e-commerce/client-web/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AsyncPipe, NgClass } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
// import {
//   CartItemComponent,
//   CartItemSkeletonComponent,
// } from '@e-commerce/client-web/shared/ui/cart-item';
// import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
// import { CartService } from '@e-commerce/client-web-app/shared/data-access/stores';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart-sidebar',
  imports: [
    NgClass,
    SidebarModule,
    ButtonModule,
    TooltipModule,
    AsyncPipe,
    InputNumberModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    ToastModule,
    // CartItemComponent,
    // CartItemSkeletonComponent,
    TooltipModule,
    NgClass,
  ],
  template: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSidebarComponent implements OnChanges {
  // private cart = inject(CartService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // cartItems = this.cart.items;
  // count = this.cart.count;
  // total = this.cart.total;
  // loading = this.cart.loading;
  error = signal<string | null>(null);

  visible = signal(false);
  skeletons = new Array(5);

  sidebarVisible = input.required<boolean>();
  onClose = output<void>();

  ngOnChanges({ sidebarVisible }: SimpleChanges): void {
    this.visible.set(sidebarVisible?.currentValue ?? false);
  }

  updateQuantity({
    book,
    quantity,
  }: {
    quantity: CartItem['quantity'];
    book: Book;
  }) {
    // this.cart.updateItemQuantity(book, quantity);
  }

  remove({ book }: { book: Book }) {
    // this.cart.removeItem(book);
  }

  async checkout() {
    // if (this.count() === 0) {
    //   this.error.set(
    //     'First add something to your cart before proceeding to checkout',
    //   );
    //   this.messageService.add({
    //     detail:
    //       'First add something to your cart before proceeding to checkout',
    //     severity: 'info',
    //     summary: 'Info',
    //   });
    //   return;
    // }

    if (this.error) this.error.set(null);

    this.onClose.emit();
    // await this.router.navigate([appRouterConfig.order.basePath]);
  }
}
