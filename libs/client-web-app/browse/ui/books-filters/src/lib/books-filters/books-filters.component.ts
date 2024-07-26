import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FilterSkeletonComponent } from '../components/filter-skeleton/filter-skeleton.component';
import { AccordionModule } from 'primeng/accordion';
import { FilterAccordionTabComponent } from '../components/filter-accordion/filter-accordion.component';
import { NgClass } from '@angular/common';
import { CategoriesFilterComponent } from '../components/categories-filter/categories-filter.component';
import { TagsFilterComponent } from '../components/tags-filter/tags-filter.component';
import { PriceFilterComponent } from '../components/price-filter/price-filter.component';
import { AuthorsFilterComponent } from '../components/authors-filter/authors-filter.component';

@Component({
  selector: 'lib-books-filters',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    FilterSkeletonComponent,
    AccordionModule,
    FilterAccordionTabComponent,
    NgClass,
    CategoriesFilterComponent,
    TagsFilterComponent,
    PriceFilterComponent,
    AuthorsFilterComponent,
  ],
  template: `
    <div
      class="sticky top-header-height height scroller overflow-y-auto w-24rem"
    >
      <p-accordion>
        <lib-tags-filter />
        <lib-categories-filter />
        <lib-authors-filter />
        <lib-price-filter />
      </p-accordion>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-listbox .p-listbox-header .p-listbox-filter {
          padding: 0.5rem;
        }

        .p-accordion .p-accordion-content {
          padding: 0;
        }
      }

      .height {
        max-height: calc(100svh - var(--header-height) - 3rem);
      }

      .top-header-height {
        top: calc(var(--header-height) + 1.5rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFiltersComponent {}
