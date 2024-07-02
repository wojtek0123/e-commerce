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

@Component({
  selector: 'lib-book-card',
  standalone: true,
  imports: [ButtonModule, RouterLink, CardModule],
  template: `
    <a
      [routerLink]="getBrowserRouteDetails(book().id)"
      class="no-underline transition-transform scale-animation card"
    >
      <p-card
        [header]="book().title"
        [style]="{ width: '100%', maxWidth: '24rem' }"
      >
        <ng-template pTemplate="header">
          <img
            alt="Card"
            class="image border-round"
            [src]="
              book().coverImage
                ? book().coverImage
                : 'https://primefaces.org/cdn/primeng/images/usercard.png'
            "
          />
        </ng-template>
        <div>rating</div>
        <ng-template pTemplate="footer">
          <div class="flex align-items-center justify-content-between">
            <span class="text-xl">{{ book().price }} $</span>
            <p-button
              class="flex justify-content-end"
              label="Add to cart"
              icon="pi pi-cart-plus"
              [loading]="awaitingBookIdsToAddToCart().includes(book().id)"
              (onClick)="addToCart($event, book())"
            ></p-button>
          </div>
        </ng-template>
      </p-card>
    </a>
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
        height: 31.875rem;
        object-fit: cover;
      }

      .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card {
        height: 43.24rem;
      }

      :host ::ng-deep {
        .p-card {
          border-radius: var(--border-radius);
        }
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
