import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BooksStore,
  MultiSelectFilters,
} from '@e-commerce/client-web/browse/data-access';
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
export class FilterComponent<T extends { id: string; name: string }> {
  private readonly booksStore = inject(BooksStore);

  public getLabelItem = (item: T) => item?.toString() ?? '';
  public filterName = signal<MultiSelectFilters | null>(null);
  public placeholder = signal<string>('');

  public getItemId = input<(item: T) => string>(
    (item) => item?.toString() ?? '',
  );

  public items = signal<T[]>([]);
  public selectedItems = signal<T[]>([]);

  public searchControl = new FormControl<string | null>(null);

  public toggleItem(item: T) {
    const filterName = this.filterName();

    if (!filterName) return;

    const isSelected = !!this.selectedItems().find(({ id }) => id === item.id);

    if (isSelected) {
      this.booksStore.unselectItem(item, filterName);
    } else {
      this.booksStore.selectItem(item, filterName);
    }
  }
}
