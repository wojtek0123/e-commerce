import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartItemSkeletonComponent } from '../cart-item-skeleton/cart-item-skeleton.component';
import { Book, CartItemBase } from '@e-commerce/shared/api-models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-cart-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CartItemComponent, CartItemSkeletonComponent, RouterLink],
  templateUrl: './cart-items.component.html',
})
export class CartItemsComponent {
  items = input.required<CartItemBase[]>();
  loading = input.required<boolean>();
  booksUrl = input.required<string>();
  readonly = input(false);

  updateQuantityEvent = output<{ bookId: Book['id']; quantity: number }>();
  removeEvent = output<Book['id']>();

  updateQuantity(quantity: CartItemBase['quantity'], bookId: Book['id']) {
    this.updateQuantityEvent.emit({ bookId, quantity });
  }

  remove(bookId: Book['id']) {
    this.removeEvent.emit(bookId);
  }
}
