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
import { OrderPriceComponent } from '@e-commerce/client-web/cart/ui';

@Component({
  selector: 'lib-order-price-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderPriceComponent],
  templateUrl: './order-price-summary.component.html',
})
export class OrderPriceSummaryComponent {
  #cartStore = inject(CartStore);
  #shippingStore = inject(ShippingStore);

  cartItemsTotal = this.#cartStore.total;
  shippingMethodPrice = computed(
    () => this.#shippingStore.selectedShipping()?.price ?? 0,
  );
  total = computed(() => this.cartItemsTotal() + this.shippingMethodPrice());
}
