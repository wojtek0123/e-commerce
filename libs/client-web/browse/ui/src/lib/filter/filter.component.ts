import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import {
  ActiveFilter,
  BrowseState,
} from '@e-commerce/client-web/browse/data-access';
import { CustomFilterDirective } from '@e-commerce/client-web/browse/utils';

@Component({
  selector: 'lib-filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    InputTextModule,
    CheckboxModule,
    AccordionModule,
    BadgeModule,
    ListboxModule,
    ButtonModule,
    FormsModule,
    CheckboxModule,
    DividerModule,
    ChipModule,
    CustomFilterDirective,
  ],
})
export class FilterComponent<FilterType> {
  public header = input.required<string>();
  public filterName = input.required<keyof BrowseState['filters']>();
  public parseName = input<(filter: FilterType) => string>();
  public parseId = input<(filter: FilterType) => number | string>();

  public items = input<FilterType[]>();
  public selectedItems = input<FilterType[]>();
  public selectedItemsCount = computed(() => this.selectedItems()?.length ?? 0);

  public clearFilterSelectedItemsEvent = output<keyof BrowseState['filters']>();
  public selectedItemsEvent = output<{
    selectedItems: FilterType[];
    activeFilter: ActiveFilter;
  }>();

  @HostBinding('style.width') width = '100%';

  templateRef = contentChild(CustomFilterDirective);

  public changeSelectedItems(selectedItems: FilterType[], item: FilterType) {
    if (!this.parseName() || !this.parseId) return;
    const activeFilter = {
      id: `${this.filterName()}_${this.parseId()?.(item).toString()}`,
      name: this.parseName()?.(item) ?? '',
    };
    this.selectedItemsEvent.emit({ selectedItems, activeFilter });
  }

  public clearFilterSelectedItems() {
    this.clearFilterSelectedItemsEvent.emit(this.filterName());
  }
}
