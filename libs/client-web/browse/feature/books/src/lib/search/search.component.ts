import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksStore } from '@e-commerce/client-web/browse/data-access';
import { AsyncPipe } from '@angular/common';
import { debounce, debounceTime, of, timer } from 'rxjs';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly booksStore = inject(BooksStore);

  public search = this.booksStore.search;

  public searchControl = new FormControl<string | null>(null);

  constructor() {
    effect(() => {
      const search = this.search();

      this.searchControl.setValue(search, { emitEvent: false });
    });
  }

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.booksStore.setSingleValueFilter(value, 'search');
      });
  }

  // public setSearch(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //
  //   this.booksStore.setSingleValueFilter(value, 'search');
  // }

  public clearInput() {
    this.booksStore.clearSingleValueFilter('search');
  }
}
