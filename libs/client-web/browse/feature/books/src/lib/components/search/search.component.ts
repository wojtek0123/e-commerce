import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksStore } from '@e-commerce/client-web/browse/data-access';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  #booksStore = inject(BooksStore);

  search = this.#booksStore.search;

  searchControl = new FormControl<string | null>(null);

  searchInputRef = viewChild.required<ElementRef>('searchInput');

  constructor() {
    effect(() => {
      const search = this.search();

      this.searchControl.setValue(search, { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.#booksStore.setSingleValueFilter(value, 'search');
      });
  }

  clearInput() {
    this.#booksStore.setSingleValueFilter(null, 'search');

    this.searchInputRef().nativeElement?.focus();
  }
}
