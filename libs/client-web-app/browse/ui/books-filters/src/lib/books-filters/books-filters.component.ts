import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BooksFilters } from '@e-commerce/client-web-app/browse/data-access';
import { FilterSkeletonComponent } from '../components/filter-skeleton/filter-skeleton.component';
import { ActivatedRoute, Router } from '@angular/router';
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
    <div class="card flex flex-column gap-4 pb-4">
      <p-accordion class="flex-column gap-4 filter-container">
        <lib-tags-filter (clearFilterEvent)="clearFilter($event)" />
        <lib-categories-filter (clearFilterEvent)="clearFilter($event)" />
        <lib-authors-filter />
        <lib-price-filter (clearFilterEvent)="clearFilter($event)" />
      </p-accordion>
      <p-button
        icon="pi pi-trash"
        label="Clear filters"
        class="w-full mt-2"
        (onClick)="clearFilters()"
      />
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

      .max-h-min {
        max-height: min-content;
      }

      .top-header-height {
        top: calc(var(--header-height) + 1.5rem);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksFiltersComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @HostBinding('class') class = 'max-w-24rem w-full hidden xl:block';

  clearFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: null,
      replaceUrl: true,
    });
  }

  clearFilter(filter: keyof BooksFilters) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [filter]: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
