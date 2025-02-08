import {
  ChangeDetectionStrategy,
  Component,
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
  item = input.required<CartItemBase>();
  appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  onUpdateQuantity = output<number>();
  onDelete = output<void>();

  quantity = linkedSignal(() => this.item().quantity);
  #timer?: ReturnType<typeof setTimeout>;

  remove() {
    this.onDelete.emit();
  }

  increase() {
    this.quantity.update((quantity) => quantity + 1);

    this.throttle(() => this.onUpdateQuantity.emit(this.quantity()));
  }

  decrease() {
    this.quantity.update((quantity) => quantity - 1);

    this.throttle(() => {
      this.onUpdateQuantity.emit(this.quantity());
    });
  }

  throttle(callbackFn: () => void, wait: number = WAIT_TIME) {
    if (this.#timer) clearTimeout(this.#timer);

    this.#timer = setTimeout(() => {
      callbackFn();
    }, wait);
  }
}
