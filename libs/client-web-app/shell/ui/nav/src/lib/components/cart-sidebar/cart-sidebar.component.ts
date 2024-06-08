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
import { CartItem } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AsyncPipe, NgClass } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartItemSkeletonComponent } from '../cart-item-skeleton/cart-item-skeleton.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';
import { CartStore } from '@e-commerce/client-web-app/shared/data-access/cart';

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
          @for (item of cartItems(); track item.id) {
          <lib-cart-item
            [item]="item"
            (onUpdateQuantity)="updateQuantity($event)"
            (onDelete)="removeFromCart($event)"
          />
          } @empty {
          <div class="text-center flex flex-column gap-3 mt-3">
            <span class="text-4xl">Your basket is empty!</span>
            <span class="text-lg text-gray-400 "
              >You should add something to it.</span
            >
          </div>
          }
        </div>

        <div class="flex flex-column gap-3">
          <div class="text-3xl">Total: {{ '$' + total().toFixed(2) }}</div>
          <div
            [pTooltip]="
              count()
                ? ''
                : 'First add something to your cart before proceeding to checkout'
            "
            tooltipPosition="top"
            tooltipStyleClass="min-w-max"
          >
            <a
              [routerLink]="appRouterConfig.order.basePath"
              (click)="onClose.emit()"
              class="no-underline p-button w-full"
              [ngClass]="{
                'p-disabled': loading() || !count()
              }"
            >
              @if (loading()) {
              <i class="pi pi-spin pi-spinner" style="font-size: 1.5rem"></i>
              } @else {
              <i class="pi pi-shopping-bag" style="font-size: 1.5rem"></i>
              }
              <span class="w-full block text-center">Checkout</span>
            </a>
          </div>
        </div>
      </div>
    </p-sidebar>
  `,
  styleUrl: './cart-sidebar.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSidebarComponent implements OnChanges {
  private cartStore = inject(CartStore);

  cartItems = this.cartStore.cartItems;
  count = this.cartStore.count;
  total = this.cartStore.total;
  loading = this.cartStore.loading;

  visible = signal(false);
  skeletons = new Array(5);
  appRouterConfig = appRouterConfig;

  sidebarVisible = input.required<boolean>();
  onClose = output<void>();

  ngOnChanges({ sidebarVisible }: SimpleChanges): void {
    this.visible.set(sidebarVisible?.currentValue ?? false);
  }

  updateQuantity({
    cartId,
    quantity,
  }: {
    cartId: CartItem['id'];
    quantity: CartItem['quantity'];
  }) {
    this.cartStore.updateQuantity({ cartId, quantity });
  }

  removeFromCart({ cartId }: { cartId: CartItem['id'] }) {
    console.log(cartId);
    this.cartStore.removeFromCart({ cartId });
  }
}
