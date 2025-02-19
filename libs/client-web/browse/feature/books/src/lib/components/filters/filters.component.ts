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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  #booksStore = inject(BooksStore);

  selectedTags = this.#booksStore.selectedTags;
  selectedAuthors = this.#booksStore.selectedAuthors;
  selectedCategories = this.#booksStore.selectedCategories;
  selectedPrices = this.#booksStore.enteredPrices;

  isSidebarVisible = signal(false);

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
}
