import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Book, CartItem, CartItemBase } from '@e-commerce/shared/api-models';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

@Component({
  selector: 'lib-cart-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  public item = input.required<CartItemBase>();
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  public onUpdateQuantity = output<{
    quantity: CartItem['quantity'];
    book: Book;
  }>();
  public onDelete = output<{ bookId: Book['id'] }>();

  public remove() {
    this.onDelete.emit({ bookId: this.item().book.id });
  }

  public increase() {
    this.onUpdateQuantity.emit({
      quantity: this.item().quantity + 1,
      book: this.item().book,
    });
  }

  public decrease() {
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
