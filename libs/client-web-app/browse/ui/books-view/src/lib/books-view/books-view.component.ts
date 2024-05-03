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
import { SkeletonComponent } from '@e-commerce/client-web-app/browse/ui/skeleton';

@Component({
  selector: 'lib-books-view',
  standalone: true,
  imports: [CardModule, ButtonModule, SkeletonModule, SkeletonComponent],
  template: `
    <div class="grid-auto-fit">
      @if (status() === 'loading') { @for (_ of skeletons; track $index) {
      <lib-skeleton />
      } } @else if (status() === 'ok') {@for (book of books(); track book.id) {
      <p-card
        [header]="book.title"
        [style]="{ width: '100%', maxWidth: '34rem' }"
      >
        <ng-template pTemplate="header">
          <img
            alt="Card"
            [src]="
              book.coverImage
                ? book.coverImage
                : 'https://primefaces.org/cdn/primeng/images/usercard.png'
            "
          />
        </ng-template>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          sed consequuntur error repudiandae numquam deserunt quisquam repellat
          libero asperiores earum nam nobis, culpa ratione quam perferendis
          esse, cupiditate neque quas!
        </p>

        <ng-template pTemplate="footer">
          <p-button
            class="flex justify-content-end"
            label="Dodaj to koszyka"
            icon="pi pi-cart-plus"
          ></p-button>
        </ng-template>
      </p-card>
      } @empty {
      <div>Brak danych do wyświetlenia!</div>
      }} @else {
      <div>Błąd podczas pobierania danych!</div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksViewComponent {
  private booksStore = inject(BooksStore);

  @HostBinding('class') class = 'w-full';

  books = computed(() => this.booksStore.books());
  status = computed(() => this.booksStore.status());
  skeletons = new Array(9);
}
