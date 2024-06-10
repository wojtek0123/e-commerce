import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  OnInit,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BooksStore } from '@e-commerce/client-web-app/browse/data-access';
import { FormsModule } from '@angular/forms';
import debounce from 'lodash-es/debounce';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { appRouterConfig } from '@e-commerce/client-web-app/shared/utils/router-config';

@Component({
  selector: 'lib-books-search',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule],
  template: `
    <div class="p-input-icon-left w-full relative">
      <i class="pi pi-search"></i>
      <input
        #searchInput
        [value]="search()"
        type="text"
        pInputText
        class="w-full pr-6"
        placeholder="Wyszukaj po tytule"
        (input)="debounceSearchValue($event)"
      />
      @if (searchInput.value.length) {
      <p-button
        class="absolute top-50 right-0 mr-2 -translate-y-50"
        icon="pi pi-trash"
        [text]="true"
        (onClick)="clearInput()"
      ></p-button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksSearchComponent implements OnInit {
  private booksStore = inject(BooksStore);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  search = computed(() => this.booksStore.filters.search() ?? '');

  searchInput = viewChild<ElementRef>('searchInput');

  @HostBinding('class') class =
    'w-full flex flex-column sm:flex-row sm:align-items-center gap-4';

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        filter((params) => !!params[appRouterConfig.browse.searchQueryParams]),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((params) => {
        const search = params[
          appRouterConfig.browse.searchQueryParams
        ] as string;

        const clear = history.state[appRouterConfig.browse.clearHistoryState];

        if (clear) {
          this.clearInput();
          history.replaceState({}, '');
        }

        (this.searchInput()?.nativeElement as HTMLInputElement).value = search;
        this.booksStore.updateFilterTitle(search);

        this.booksStore.getFilterBooks();
      });
  }
  debounceSearchValue = debounce((event) => this.setFilterTitle(event), 500);

  setFilterTitle(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.booksStore.updateFilterTitle(value || null);

    if (!value) this.booksStore.getFilterBooks();
  }

  clearInput() {
    this.booksStore.updateFilterTitle(null);
    (this.searchInput()?.nativeElement as HTMLInputElement).value = '';
  }
}
