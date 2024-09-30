import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BooksState,
  BooksStore,
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
export class FilterComponent<T> {
  private readonly booksStore = inject(BooksStore);

  public getLabelItem = (item: T) => item?.toString() ?? '';
  // @Input() public trackFn = (index: number, item: T): number | string => index;
  public filterName = signal<keyof BooksState['filters'] | null>(null);
  public placeholder = signal<string>('');

  public getItemId = input<(item: T) => string>(
    (item) => item?.toString() ?? '',
  );

  public items = signal<T[]>([]);
  public selectedItems = signal<T[]>([]);

  public searchControl = new FormControl<string | null>(null);

  public selectItem(selectedItems: T[], item: T) {
    const getItemId = this.getItemId();
    const filterName = this.filterName();

    if (!getItemId || !filterName) return;

    const activeFilter = {
      id: `${this.filterName()}_${getItemId(item).toString()}`,
      name: this.getLabelItem(item) ?? '',
    };
    this.booksStore.setSelectedItems(selectedItems, filterName, activeFilter);
  }
}
