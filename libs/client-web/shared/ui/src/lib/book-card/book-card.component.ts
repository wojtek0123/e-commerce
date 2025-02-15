import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { RatingInputComponent } from '../rating-input/rating-input.component';
import { FormsModule } from '@angular/forms';

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
    NgClass,
    RatingInputComponent,
    FormsModule,
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
  loading = input(false);

  averageRating = computed(() => {
    const reviews = this.book().reviews;

    if (reviews.length === 0) return 0;

    return +(
      reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
    ).toFixed(1);
  });

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
