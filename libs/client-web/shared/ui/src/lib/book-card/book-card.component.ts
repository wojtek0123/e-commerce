import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Book } from '@e-commerce/shared/api-models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

@Pipe({ standalone: true, name: 'isBookFavourite' })
export class IsBookFavouritePipe implements PipeTransform {
  transform(book: Book, favouriteBooks: Book[]) {
    return !!favouriteBooks?.find(({ id }) => id === book.id)
      ? 'pi pi-heart-fill'
      : 'pi pi-heart';
  }
}

@Component({
  selector: 'lib-book-card',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    CardModule,
    CurrencyPipe,
    NgOptimizedImage,
    IsBookFavouritePipe,
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sm:max-w-book-card',
  },
})
export class BookCardComponent {
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  public book = input.required<Book>();
  public awaitingBookIdsToAddToCart = input<Book['id'][]>([]);
  favouriteBooks = input.required<Book[]>();

  public onAddToCart = output<Book>();
  onAddToFavourite = output<Book>();

  public addToCart(event: Event, book: Book) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.onAddToCart.emit(book);
  }

  addToFavourite(book: Book) {
    this.onAddToFavourite.emit(book);
  }
}
