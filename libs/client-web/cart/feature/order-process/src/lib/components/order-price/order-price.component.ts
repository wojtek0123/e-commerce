import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  CartStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'lib-order-price',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, Divider],
  templateUrl: './order-price.component.html',
})
export class OrderPriceComponent {
  #cartStore = inject(CartStore);
  #shippingStore = inject(ShippingStore);

  cartItemsTotal = this.#cartStore.total;
  shippingMethodPrice = computed(
    () => this.#shippingStore.selectedShipping()?.price ?? 0,
  );
  total = computed(() => this.cartItemsTotal() + this.shippingMethodPrice());
}
