import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Book } from '@e-commerce/client-web/shared/data-access';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'lib-book-card',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    CardModule,
    CurrencyPipe,
    NgOptimizedImage,
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sm:max-w-book-card',
  },
})
export class BookCardComponent {
  book = input.required<Book>();
  awaitingBookIdsToAddToCart = input<Book['id'][]>([]);

  onAddToCart = output<Book>();

  addToCart(event: Event, book: Book) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.onAddToCart.emit(book);
  }
}
