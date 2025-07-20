import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CartItemSkeletonComponent } from './cart-item-skeleton/cart-item-skeleton.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-cart-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CartItemSkeletonComponent, RouterLink],
  templateUrl: './cart-items.component.html',
})
export class CartItemsComponent {
  itemsCount = input.required<number>();
  loading = input.required<boolean>();
  booksUrl = input.required<string>();
}
