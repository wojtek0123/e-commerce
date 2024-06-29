import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import {
  Book,
  CartItem,
  CartItemBase,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AsyncPipe, NgClass } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartItemSkeletonComponent } from '../cart-item-skeleton/cart-item-skeleton.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { CartStore } from '@e-commerce/client-web-app/shared/data-access/cart';
import { MessageService } from 'primeng/api';
import { AuthStore } from '@e-commerce/client-web-app/shared/data-access/auth';

@Component({
  selector: 'lib-cart-sidebar',
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
    CartItemComponent,
    CartItemSkeletonComponent,
    TooltipModule,
    NgClass,
  ],
  template: `
    <p-sidebar
      [(visible)]="visible"
      [closeOnEscape]="true"
      (onHide)="onClose.emit()"
      position="right"
      appendTo="body"
      [blockScroll]="true"
    >
      <ng-template pTemplate="header">
        <span class="font-semibold text-xl">Cart</span>
      </ng-template>

      <div class="flex flex-column justify-content-between h-full gap-3">
        <div
          class="flex flex-column gap-3 overflow-y-auto"
          [ngClass]="{
            'animation-pulse pointer-events-none': loading()
          }"
        >
          @for (item of cartItems(); track item.book.id) {
          <lib-cart-item
            [item]="item"
            (onUpdateQuantity)="updateQuantity($event)"
            (onDelete)="remove($event)"
          />
          } @empty {
          <div class="text-center flex flex-column gap-3 mt-3">
            <span class="text-4xl">Your cart is empty!</span>
            <span class="text-lg text-gray-400 "
              >You should add something to it.</span
            >
          </div>
          }
        </div>

        <div class="flex flex-column gap-3">
          <div class="text-3xl">Total: {{ '$' + total().toFixed(2) }}</div>
          <p-button
            class="w-full"
            label="Checkout"
            icon="pi pi-shopping-bag"
            (onClick)="checkout()"
            [loading]="loading()"
          />
        </div>
      </div>
    </p-sidebar>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSidebarComponent implements OnChanges {
  private cartStore = inject(CartStore);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  constructor() {
    effect(() => {
      console.log(this.cartItems());
    });
  }

  cartItems = this.cartStore.items;
  count = this.cartStore.count;
  total = this.cartStore.total;
  loading = this.cartStore.loading;
  error = signal<string | null>(null);
  isAuthenticated = computed(() => !!this.authStore.user());

  visible = signal(false);
  skeletons = new Array(5);
  appRouterConfig = appRouterConfig;

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
    this.cartStore.updateQuantity({ bookId: book.id, quantity });
  }

  remove({ book }: { book: Book }) {
    this.cartStore.removeItemFromCart({ book });
  }

  async checkout() {
    if (this.count() === 0) {
      this.error.set(
        'First add something to your cart before proceeding to checkout'
      );
      this.messageService.add({
        detail:
          'First add something to your cart before proceeding to checkout',
        severity: 'info',
        summary: 'Info',
      });
      return;
    }

    if (this.error) this.error.set(null);

    this.onClose.emit();

    await this.router.navigate([appRouterConfig.order.basePath]);
  }
}
