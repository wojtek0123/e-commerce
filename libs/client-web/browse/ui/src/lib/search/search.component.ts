import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  model,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { debounce, distinctUntilChanged, of, timer } from 'rxjs';

@Component({
  selector: 'lib-search',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  search = model<string | null>(null);

  debouncedSearchChange = outputFromObservable(
    toObservable(this.search).pipe(
      distinctUntilChanged(),
      debounce((search) => (search ? timer(300) : of({}))),
    ),
  );

  searchInputRef = viewChild.required<ElementRef>('searchInput');

  clearInput() {
    this.searchInputRef().nativeElement?.focus();
    this.search.set(null);
  }
}
