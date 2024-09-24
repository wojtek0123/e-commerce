import { Component, forwardRef, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'lib-select-items-filter',
  standalone: true,
  imports: [FormsModule, CheckboxModule],
  templateUrl: './select-items-filter.component.html',
  styleUrl: './select-items-filter.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectItemsFilterComponent),
      multi: true,
    },
  ],
})
export class SelectItemsFilterComponent<T> implements ControlValueAccessor {
  selectedItems = signal<T[]>([]);
  items = signal<T[]>([]);

  getItemLabel = (item: T | null) => item?.toString();
  trackFn = (index: number, _: T) => index;
  filterName = signal('');

  public changeSelectedItems(selectedItems: T[], item: T) {
    // const activeFilter = {
    //   id: `${this.filterName()}_${this.trackFn(0, item).toString()}`,
    //   name: this.getItemLabel(item) ?? '',
    // };
    // this.selectedItemsEvent.emit({ selectedItems, activeFilter });

    this.onChange(selectedItems);
  }

  onChange = (items: T[]) => {};
  onTouched = () => {};

  writeValue(items: T[]): void {
    this.onChange(items);
  }
  registerOnChange(fn: (items: T[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {}
}
