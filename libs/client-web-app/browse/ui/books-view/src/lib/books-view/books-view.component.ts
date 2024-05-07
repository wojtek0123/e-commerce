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
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonComponent } from '../components/skeleton/skeleton.component';
import { RouterLink } from '@angular/router';
import { getBrowserRouteDetails } from '@e-commerce/client-web-app/shared/utils/router-config';

@Component({
  selector: 'lib-books-view',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    SkeletonModule,
    SkeletonComponent,
    RouterLink,
  ],
  template: `
    <div class="grid-auto-fit">
      @if (status() === 'loading') { @for (_ of skeletons; track $index) {
      <lib-skeleton />
      } } @else if (status() === 'ok') {@for (book of books(); track book.id) {
      <a
        [routerLink]="getBrowserRouteDetails(book.id)"
        class="no-underline transition-transform scale-animation"
      >
        <p-card
          [header]="book.title"
          [style]="{ width: '100%', maxWidth: '34rem' }"
        >
          <ng-template pTemplate="header">
            <img
              alt="Card"
              class="h-23rem"
              [src]="
                book.coverImage
                  ? book.coverImage
                  : 'https://primefaces.org/cdn/primeng/images/usercard.png'
              "
            />
          </ng-template>
          @for (author of book.authors; track $index) {
          <span>{{ author.author.name }}</span>
          }
          <ng-template pTemplate="footer">
            <div class="flex align-items-center justify-content-between">
              <span class="text-xl">{{ book.price }} $</span>
              <p-button
                class="flex justify-content-end"
                label="Dodaj to koszyka"
                icon="pi pi-cart-plus"
                (onClick)="addToCart($event)"
              ></p-button>
            </div>
          </ng-template>
        </p-card>
      </a>
      } @empty {
      <div class="text-center grid-all-columns mt-8">
        <span class="text-3xl">Nie znaleziono żadnych książek!</span>
      </div>
      }} @else {
      <div class="text-center grid-all-columns mt-8">
        <span class="text-3xl text-error">Błąd podczas pobierania danych!</span>
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
        transform: scale(1.05);
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
