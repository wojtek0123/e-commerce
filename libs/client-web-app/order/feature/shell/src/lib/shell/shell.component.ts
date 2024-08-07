import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { StepService } from '@e-commerce/client-web-app/order/data-access';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/stores';
import {
  CartItemComponent,
  CartItemSkeletonComponent,
} from '@e-commerce/client-web-app/shared/ui/cart-item';
import {
  Book,
  CartItem,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CurrencyPipe, NgClass } from '@angular/common';
import { SummaryComponent } from '@e-commerce/client-web-app/order/feature/summary';

@Component({
  selector: 'lib-shell',
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
  template: `
    <p-toast />
    <div class="w-full flex flex-column gap-6 p-3">
      <div class="grid">
        <div class="cart flex flex-column gap-3 xl:gap-6">
          <h2 class="xl:text-5xl">Cart items</h2>
          <div
            class="flex flex-column gap-3"
            [ngClass]="{
              'animation-pulse pointer-events-none':
                cartItemsLoading() && cartItems().length > 0,
            }"
          >
            @if (cartItemsLoading() && cartItems().length === 0) {
              <lib-cart-item-sekeleton />
            } @else {
              @for (cartItem of cartItems(); track cartItem.book.id) {
                <lib-cart-item
                  [item]="cartItem"
                  (onDelete)="remove($event)"
                  (onUpdateQuantity)="updateQuantity($event)"
                />
              }
            }
          </div>
        </div>
        <div class="w-full content flex flex-column gap-3 xl:gap-6">
          <h2 class="xl:text-5xl">Checkout form</h2>
          <div class="w-full">
            <lib-summary />
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shell.component.css',
})
export class ShellComponent implements OnInit {
  private stepService = inject(StepService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @HostBinding('class') class = 'flex flex-column p-3';

  cartItems = this.cartService.items;
  cartItemsLoading = this.cartService.loading;
  total = this.cartService.total;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (events) =>
            events instanceof NavigationStart && !events.url.includes('order'),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.stepService.resetStep();
      });
  }

  updateQuantity({
    book,
    quantity,
  }: {
    quantity: CartItem['quantity'];
    book: Book;
  }) {
    this.cartService.updateItemQuantity(book, quantity);
  }

  remove({ book }: { book: Book }) {
    this.cartService.removeItem(book);
  }
}
