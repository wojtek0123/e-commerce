import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BooksFilters } from '@e-commerce/client-web-app/browse/data-access';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'lib-filter-accordion-tab',
  template: `
    <p-accordionTab>
      <ng-template pTemplate="header">
        <span class="font-bold white-space-nowrap">{{ header() }}</span>
        <p-badge
          [value]="selectedItems().length.toString()"
          class="ml-2"
          styleClass="p-badge-secondary"
        />
        <p-button
          class="ml-3"
          icon="pi pi-trash"
          [text]="true"
          (onClick)="clearFilter($event, filterName())"
        ></p-button>
      </ng-template>
      <p-listbox
        [options]="items()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [formControl]="formControl()"
        [filter]="items().length > 10 ? true : false"
        [checkbox]="true"
        [multiple]="true"
        [listStyle]="{
          'max-height': height().maxHeight,
          height: height().base
        }"
        (onChange)="onChange($event)"
      />
    </p-accordionTab>
  `,
  standalone: true,
  imports: [
    AccordionModule,
    ListboxModule,
    ButtonModule,
    BadgeModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterAccordionTabComponent<T> {
  items = input.required<T[]>();
  filterName = input.required<keyof BooksFilters>();
  header = input.required<string>();
  height = input<{ maxHeight: string; base: string }>({
    maxHeight: 'max-content',
    base: '100%',
  });

  optionLabel = input<string | undefined>(undefined);
  optionValue = input<string | undefined>(undefined);

  clearEvent = output<keyof BooksFilters>();
  changeEvent = output<T[]>();

  selectedItems = input.required<T[]>();

  protected formControl = computed(
    () => new FormControl<T[] | null>(this.selectedItems())
  );

  clearFilter(event: Event, filter: keyof BooksFilters) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.clearEvent.emit(filter);
  }

  onChange(event: ListboxChangeEvent) {
    this.changeEvent.emit(event.value);
  }
}
