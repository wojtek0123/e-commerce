import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { CartItemBase } from '@e-commerce/shared/api-models';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { Image } from 'primeng/image';

export const WAIT_TIME = 300 as const;

@Component({
  selector: 'lib-cart-item',
  imports: [
    CurrencyPipe,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    RouterLink,
    Image,
  ],
  templateUrl: './cart-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  cartItem = input.required<CartItemBase>();
  readonly = input(false);

  updateQuantityEvent = output<number>();
  deleteEvent = output<void>();

  bookDetailsUrl = computed(() =>
    this.#appRoutePaths.BOOK(this.cartItem().book.id),
  );

  quantity = linkedSignal(() => this.cartItem().quantity);
  #timer?: ReturnType<typeof setTimeout>;

  remove() {
    this.deleteEvent.emit();
  }

  increase() {
    this.quantity.update((quantity) => quantity + 1);

    this.throttle(() => this.updateQuantityEvent.emit(this.quantity()));
  }

  decrease() {
    this.quantity.update((quantity) => quantity - 1);

    this.throttle(() => {
      this.updateQuantityEvent.emit(this.quantity());
    });
  }

  throttle(callbackFn: () => void, wait: number = WAIT_TIME) {
    if (this.#timer) clearTimeout(this.#timer);

    this.#timer = setTimeout(() => {
      callbackFn();
    }, wait);
  }
}
