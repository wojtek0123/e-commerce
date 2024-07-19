import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { BooksFilters } from '@e-commerce/client-web-app/browse/data-access';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'lib-filter-accordion-tab',
  template: `
    <p-accordionTab>
      <ng-template pTemplate="header">
        <div class="flex align-items-center">
          <span class="font-bold white-space-nowrap">{{ header() }}</span>
          <p-badge
            [value]="selectedItemsCount()"
            class="ml-2"
            styleClass="p-badge-secondary"
          />
          <p-button
            class="ml-3"
            icon="pi pi-trash"
            [text]="true"
            (onClick)="clearFilter($event, filterName())"
          />
        </div>
      </ng-template>
      <div class="container">
        <ng-content />
      </div>
    </p-accordionTab>
  `,
  standalone: true,
  imports: [AccordionModule, ListboxModule, ButtonModule, BadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host ::ng-deep {
        .p-accordion-header-link {
          background: var(--surface-ground) !important;
          border-radius: var(--border-radius) !important;
        }
      }

      .container {
        padding: 1.125rem;
      }
    `,
  ],
})
export class FilterAccordionTabComponent {
  filterName = input.required<keyof BooksFilters>();
  header = input.required<string>();
  selectedItemsCount = input.required<number>();
  height = input<{ maxHeight: string; base: string }>({
    maxHeight: 'max-content',
    base: 'fit-content',
  });

  clearEvent = output<keyof BooksFilters>();

  clearFilter(event: Event, filter: keyof BooksFilters) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.clearEvent.emit(filter);
  }
}
