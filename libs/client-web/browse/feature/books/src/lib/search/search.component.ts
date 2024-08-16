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
import { Store } from '@ngrx/store';
import {
  selectSearch,
  browseActions,
} from '@e-commerce/client-web/browse/data-access';
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
  private store = inject(Store);

  search$ = this.store.select(selectSearch);

  @HostBinding('style.maxWidth') maxWidth = '30rem';
  @HostBinding('style.width') width = '100%';

  setSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.dispatch(browseActions.setSearch({ value }));
  }

  setFilterTitle(event: Event) {
    // const value = (event.target as HTMLInputElement).value;
    //
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     search: value || null,
    //   },
    //   queryParamsHandling: 'merge',
    //   replaceUrl: true,
    // });
  }

  clearInput() {
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     search: null,
    //   },
    //   queryParamsHandling: 'merge',
    //   replaceUrl: true,
    // });
    // (this.searchInput()?.nativeElement as HTMLInputElement).value = '';
    this.store.dispatch(browseActions.setSearch({ value: null }));
  }
}
