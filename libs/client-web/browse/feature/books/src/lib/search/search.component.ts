import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { BooksStore } from '@e-commerce/client-web/browse/data-access';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  private readonly booksStore = inject(BooksStore);

  search = this.booksStore.search;

  setSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.booksStore.setSearch(value);
  }

  clearInput() {
    this.booksStore.setSearch(null);
  }
}
