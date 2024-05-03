import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BooksStore } from '@e-commerce/client-web-app/books/data-access';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [ButtonModule, InputTextModule],
  template: `
    <div class="p-input-icon-left w-full">
      <i class="pi pi-search"></i>
      <input
        type="text"
        pInputText
        class="w-full"
        (change)="setFilterTitle($event)"
      />
    </div>
    <p-button
      class="w-full sm:w-fit"
      label="Szukaj"
      size="large"
      icon="pi pi-search"
      (click)="filterBooks()"
    ></p-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private booksStore = inject(BooksStore);

  @HostBinding('class') class =
    'w-full flex flex-column sm:flex-row sm:align-items-center gap-4';

  setFilterTitle(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.booksStore.setFilters({ title: value || null });
  }

  filterBooks() {
    this.booksStore.filterBooks();
  }
}
