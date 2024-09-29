import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
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

  search = this.store.selectSignal(selectSearch);

  setSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.store.dispatch(browseActions.setSearch({ value }));
  }

  clearInput() {
    this.store.dispatch(browseActions.setSearch({ value: null }));
  }
}
