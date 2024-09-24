import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  browseActions,
  BrowseState,
} from '@e-commerce/client-web/browse/data-access';
import { Store } from '@ngrx/store';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'lib-filter',
  standalone: true,
  imports: [InputTextModule, CheckboxModule, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './filter.component.scss',
  templateUrl: './filter.component.html',
})
export class FilterComponent<T> {
  private readonly store = inject(Store);

  public getLabelItem = (item: T) => item?.toString() ?? '';
  public trackFn = (index: number, _: T): number | string => index;
  public filterName = signal<keyof BrowseState['filters']>('author');
  public placeholder = signal<string>('');

  public items = signal<T[]>([]);
  public selectedItems = signal<T[]>([]);

  public searchControl = new FormControl<string | null>(null);

  public selectItem(selectedItems: T[], item: T) {
    const activeFilter = {
      id: `${this.filterName()}_${this.trackFn(0, item).toString()}`,
      name: this.getLabelItem(item) ?? '',
    };
    this.store.dispatch(
      browseActions.setSelectedItems({
        selectedItems,
        activeFitler: activeFilter,
        filter: this.filterName(),
      }),
    );
  }
}
