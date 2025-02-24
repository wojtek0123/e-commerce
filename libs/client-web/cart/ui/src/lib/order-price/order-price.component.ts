import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'lib-order-price',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, Divider],
  templateUrl: './order-price.component.html',
})
export class OrderPriceComponent {
  cartTotal = input.required<number>();
  shippingPrice = input.required<number>();
  total = computed(() => this.cartTotal() + this.shippingPrice());
}
