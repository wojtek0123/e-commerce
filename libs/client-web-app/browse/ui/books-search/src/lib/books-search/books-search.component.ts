import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  inject,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import debounce from 'lodash-es/debounce';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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
        placeholder="Search by title"
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
export class BooksSearchComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  search = toSignal(
    this.route.queryParams.pipe(
      map(
        (queryParams) =>
          queryParams[appRouterConfig.browse.searchQueryParams] || null
      )
    )
  );

  searchInput = viewChild<ElementRef>('searchInput');

  @HostBinding('class') class =
    'w-full flex flex-column sm:flex-row sm:align-items-center gap-4';

  debounceSearchValue = debounce((event) => this.setFilterTitle(event), 500);

  setFilterTitle(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.browse.searchQueryParams]: value || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  clearInput() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [appRouterConfig.browse.searchQueryParams]: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    (this.searchInput()?.nativeElement as HTMLInputElement).value = '';
  }
}
