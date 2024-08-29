import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  Book,
  CartItem,
  CartItemBase,
} from '@e-commerce/client-web/shared/data-access';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-cart-item',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule, InputNumberModule, FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  item = input.required<CartItemBase>();

  onUpdateQuantity = output<{
    quantity: CartItem['quantity'];
    book: Book;
  }>();
  onDelete = output<{ bookId: Book['id'] }>();

  remove() {
    this.onDelete.emit({ bookId: this.item().book.id });
  }

  increase() {
    this.onUpdateQuantity.emit({
      quantity: this.item().quantity + 1,
      book: this.item().book,
    });
  }

  decrease() {
    const quantity = this.item().quantity - 1;

    if (quantity < 1) {
      this.onDelete.emit({ bookId: this.item().book.id });
    } else {
      this.onUpdateQuantity.emit({
        quantity,
        book: this.item().book,
      });
    }
  }
}
