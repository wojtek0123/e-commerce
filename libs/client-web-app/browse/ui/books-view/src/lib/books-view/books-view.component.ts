import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  inject,
} from '@angular/core';
import { BooksStore } from '@e-commerce/client-web-app/browse/data-access';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { getBrowserRouteDetails } from '@e-commerce/client-web-app/shared/utils/router-config';
import {
  BookCardSkeletonComponent,
  BookCardComponent,
} from '@e-commerce/client-web-app/shared/ui/book-card';
import { CartItemsApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import {
  Book,
  ResponseError,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'lib-books-view',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    RouterLink,
    BookCardComponent,
    BookCardSkeletonComponent,
  ],
  template: `
    <div class="grid-auto-fit">
      @if (status() === 'loading') { @for (_ of skeletons; track $index) {
      <lib-book-card-skeleton />
      } } @else if (status() === 'ok') {@for (book of books(); track book.id) {
      <lib-book-card [book]="book" (onAddToCart)="addToCart($event)" />
      } @empty {
      <div class="text-center grid-all-columns mt-8">
        <span class="text-3xl">No books were found!</span>
      </div>
      }} @else {
      <div class="text-center grid-all-columns mt-8">
        <span class="text-3xl text-error">Error while fetching the data</span>
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .scale-animation {
        transform: scale(1);
        transition: transform 250ms ease-in-out;
      }

      .scale-animation:hover {
        transform: scale(0.95);
      }
    `,
  ],
})
export class BooksViewComponent {
  private booksStore = inject(BooksStore);
  private cartItemsApi = inject(CartItemsApiService);
  private messageService = inject(MessageService);

  @HostBinding('class') class = 'w-full min-content-height';

  books = computed(() => this.booksStore.books());
  status = computed(() => this.booksStore.status());
  skeletons = new Array(9);

  getBrowserRouteDetails = getBrowserRouteDetails;

  addToCart(book: Book) {
    this.cartItemsApi
      .createCartItem({ bookId: book.id, quantity: 1 })
      .subscribe({
        next: () => {
          this.messageService.add({
            summary: 'Success',
            detail: `${book.title} has been added to cart successfully`,
            severity: 'success',
          });
        },
        error: (responseError: ResponseError) => {
          this.messageService.add({
            summary: 'Error',
            detail: responseError.error.message,
            severity: 'danger',
          });
        },
      });
  }
}
