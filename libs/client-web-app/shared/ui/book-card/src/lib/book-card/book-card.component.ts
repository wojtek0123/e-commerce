import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { Book } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { getBrowserRouteDetails } from '@e-commerce/client-web-app/shared/utils/router-config';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-book-card',
  standalone: true,
  imports: [ButtonModule, RouterLink, CardModule, CurrencyPipe],
  template: `
    <div
      [routerLink]="getBrowserRouteDetails(book().id)"
      class="surface-hover cursor-pointer no-underline text-color border-round flex flex-column"
    >
      <img
        alt="Card"
        class="w-full image border-round"
        [src]="
          book().coverImage
            ? book().coverImage
            : 'https://primefaces.org/cdn/primeng/images/usercard.png'
        "
      />
      <div class="flex flex-column gap-3 p-3">
        <div class="flex flex-column gap-1">
          <h3 class="text-xl font-bold">{{ book().title }}</h3>
          @for (author of book().authors; track author.id) {
            <div class="text-color-secondary">{{ author.name }}</div>
          }
        </div>
        <div class="flex align-items-center justify-content-between">
          <span class="text-xl font-semibold">{{
            book().price | currency: 'USD'
          }}</span>
          <p-button
            class="flex justify-content-end"
            label="Add to cart"
            icon="pi pi-cart-plus"
            [loading]="awaitingBookIdsToAddToCart().includes(book().id)"
            (onClick)="addToCart($event, book())"
          ></p-button>
        </div>
      </div>
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

      .image {
        /* object-fit: cover; */
        aspect-ratio: 3 / 4;
      }

      .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
})
export class BookCardComponent {
  book = input.required<Book>();
  awaitingBookIdsToAddToCart = input<Book['id'][]>([]);

  onAddToCart = output<Book>();

  getBrowserRouteDetails = getBrowserRouteDetails;

  @HostBinding('class') class = 'card';

  addToCart(event: Event, book: Book) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.onAddToCart.emit(book);
  }
}
