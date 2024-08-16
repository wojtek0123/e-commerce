import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  ],
})
export class FilterComponent<FilterType> {
  public header = input.required<string>();
  public filterName = input.required<string>();
  public parseName = input.required<(filter: FilterType) => string>();
  public trackBy = input.required<(filter: FilterType) => number | string>();

  public items = input.required<FilterType[]>();
  public selectedItems = input.required<FilterType[]>();
  public selectedItemsCount = computed(() => this.selectedItems().length);

  public clearFilterEvent = output<string>();
  public selectedItemsEvent = output<FilterType[]>();

  @HostBinding('style.width') width = '100%';

  public changeSelectedItems(event: FilterType[]) {
    this.selectedItemsEvent.emit(event);
  }
}
