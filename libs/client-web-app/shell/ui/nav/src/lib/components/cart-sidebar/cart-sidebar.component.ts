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
import { CartItemsApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import {
  Observable,
  catchError,
  firstValueFrom,
  ignoreElements,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import {
  CartItem,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AsyncPipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { MessageService } from 'primeng/api';
import { CartItemSkeletonComponent } from '../cart-item-skeleton/cart-item-skeleton.component';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

@Component({
  selector: 'lib-cart-sidebar',
  imports: [
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

      @if ({cartItems: userCartItems$ | async, error: userCartItemsError$ |
      async}; as vm) { @if (!vm.cartItems && !vm.error) {
      <div class="flex flex-column gap-3 overflow-y-auto">
        @for (_ of skeletons; track $index) {
        <lib-cart-item-sekeleton />
        }
      </div>
      } @else if (!vm.cartItems && vm.error) {
      <div>{{ vm.error }}</div>
      } @else if (vm.cartItems && !vm.error) {
      <div class="flex flex-column justify-content-between h-full gap-3">
        <div class="flex flex-column gap-3 overflow-y-auto">
          @for (item of vm.cartItems; track item.id) {
          <lib-cart-item
            [item]="item"
            (onUpdateQuantity)="updateQuantity($event)"
            (onDelete)="deleteItemFromCart($event)"
          />
          } @empty {
          <div class="text-center text-2xl text-gray-300">
            Add something to cart too see it here.
          </div>
          }
        </div>

        <div class="flex flex-column gap-3">
          <div class="text-3xl">
            Total: {{ '$' + totalAmount().toFixed(2) }}
          </div>
          <a
            [routerLink]="appRouterConfig.order.basePath"
            (click)="onClose.emit()"
            class="no-underline p-button"
          >
            <i class="pi pi-shopping-bag" style="font-size: 1.5rem"></i>
            <span class="w-full block text-center">Go to order</span>
          </a>
        </div>
      </div>
      } }
    </p-sidebar>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-sidebar-right {
          width: 45rem;
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSidebarComponent implements OnChanges {
  private cartItemsApi = inject(CartItemsApiService);
  private messageService = inject(MessageService);

  totalAmount = signal(0);
  visible = signal(false);
  skeletons = new Array(5);
  appRouterConfig = appRouterConfig;

  sidebarVisible = input.required<boolean>();
  onClose = output<void>();

  userCartItems$ = new Observable<CartItem[]>();
  userCartItemsError$ = new Observable<string>();

  ngOnChanges({ sidebarVisible }: SimpleChanges): void {
    this.visible.set(sidebarVisible?.currentValue ?? false);

    if (sidebarVisible?.currentValue) {
      this.getCartItems();
    }
  }

  getCartItems() {
    this.userCartItems$ = this.cartItemsApi.getUserCartItems().pipe(
      tap((cartItems) => this.calculateTotalPrice(cartItems)),
      take(1)
    );

    this.userCartItemsError$ = this.userCartItems$.pipe(
      ignoreElements(),
      catchError((responseError: ResponseError) =>
        of(responseError.error.message)
      ),
      take(1)
    );
  }

  calculateTotalPrice(cartItems: CartItem[]) {
    const totalPrice = cartItems.reduce(
      (acc, curr) => acc + curr.quantity * curr.book.price,
      0
    );

    this.totalAmount.set(totalPrice);
  }

  updateQuantity({
    id,
    quantity,
  }: {
    id: CartItem['id'];
    quantity: CartItem['quantity'];
  }) {
    this.cartItemsApi.updateQuantity(id, { quantity }).subscribe({
      next: async () => {
        const cartItems = await firstValueFrom(this.userCartItems$);
        this.calculateTotalPrice(cartItems);

        this.messageService.add({
          summary: 'Success',
          detail: 'Book quantity has been updated',
          severity: 'success',
        });
      },
      error: (responseError: ResponseError) => {
        this.messageService.add({
          summary: 'Error',
          detail: responseError.error.message || 'Something went wrong!',
          severity: 'error',
        });
      },
    });
  }

  deleteItemFromCart({ id }: { id: CartItem['id'] }) {
    this.cartItemsApi.deleteCartItem(id).subscribe({
      next: async () => {
        this.messageService.add({
          summary: 'Success',
          detail: 'Book has been deleted from cart',
          severity: 'success',
        });

        this.userCartItems$ = this.userCartItems$.pipe(
          map((cartItems) =>
            cartItems.filter((cartItem) => cartItem.id !== id)
          ),
          tap((cartItems) => this.calculateTotalPrice(cartItems))
        );
      },
      error: (responseError: ResponseError) => {
        this.messageService.add({
          summary: 'Error',
          detail: responseError.error.message || 'Something went wrong!',
          severity: 'error',
        });
      },
    });
  }
}
