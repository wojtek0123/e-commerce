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
      <lib-book-card [book]="book" />
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

  @HostBinding('class') class = 'w-full min-content-height';

  books = computed(() => this.booksStore.books());
  status = computed(() => this.booksStore.status());
  skeletons = new Array(9);

  getBrowserRouteDetails = getBrowserRouteDetails;

  addToCart(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
