import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PriceFilterComponent } from './price-filters/price-filters.component';
import { ButtonModule } from 'primeng/button';
import { NgTemplateOutlet } from '@angular/common';
import {
  BooksStore,
  MultiSelectFilters,
  SingleValueFilters,
} from '@e-commerce/client-web/browse/data-access';
import { AccordionFilterHeaderComponent } from '@e-commerce/client-web/browse/ui';
import { AuthorsDirective } from './directives/authors.directive';
import { FilterComponent } from './filter/filter.component';
import { CategoriesDirective } from './directives/category.directive';
import { TagsDirective } from './directives/tags.directive';
import { DrawerModule } from 'primeng/drawer';
import { DrawerLeftDirective } from '@e-commerce/client-web/shared/utils';
import {
  AccordionComponent,
  AccordionPanelComponent,
} from '@e-commerce/client-web/shared/ui';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PublishersDirective } from './directives/publishers.directive';

@Component({
  selector: 'lib-filters',
  standalone: true,
  imports: [
    AccordionModule,
    PriceFilterComponent,
    DrawerModule,
    ButtonModule,
    NgTemplateOutlet,
    AccordionFilterHeaderComponent,
    FilterComponent,
    AuthorsDirective,
    CategoriesDirective,
    TagsDirective,
    DrawerLeftDirective,
    AccordionComponent,
    AccordionPanelComponent,
    OverlayBadgeModule,
    PublishersDirective,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  #booksStore = inject(BooksStore);
  #breakpointObserver = inject(BreakpointObserver);

  selectedTags = this.#booksStore.selectedTags;
  selectedAuthors = this.#booksStore.selectedAuthors;
  selectedCategories = this.#booksStore.selectedCategories;
  selectedPublishers = this.#booksStore.selectedPublishers;
  selectedPrices = this.#booksStore.enteredPrices;
  isAnyFilterSelected = this.#booksStore.isAnyFilterSelected;

  activeFiltersCount = this.#booksStore.activeFiltersCount;

  isSidebarVisible = signal(false);

  constructor() {
    this.#breakpointObserver
      .observe('(min-width: 1280px)')
      .pipe(
        map(({ matches }) => matches),
        filter((matches) => matches),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.isSidebarVisible.set(false);
      });
  }

  clearSelectedItems(filter: MultiSelectFilters) {
    this.#booksStore.clearSelectedItems(filter);
  }

  clearSingleValueFilter(filter: SingleValueFilters) {
    this.#booksStore.setSingleValueFilter(null, filter);
  }

  clearPriceFilter() {
    this.#booksStore.setSingleValueFilter(null, 'minPrice');
    this.#booksStore.setSingleValueFilter(null, 'maxPrice');
  }

  removeActiveFitlers() {
    this.#booksStore.removeActiveFilters();
  }
}
