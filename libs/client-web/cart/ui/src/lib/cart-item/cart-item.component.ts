import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Book, CartItem, CartItemBase } from '@e-commerce/shared/api-models';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { Image } from 'primeng/image';

@Component({
  selector: 'lib-cart-item',
  standalone: true,
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
