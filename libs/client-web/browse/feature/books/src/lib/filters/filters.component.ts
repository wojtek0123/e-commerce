import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PriceFilterComponent } from './price-filters/price-filters.component';
import { SidebarModule } from 'primeng/sidebar';
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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  private readonly booksStore = inject(BooksStore);

  public selectedTags = this.booksStore.selectedTags;
  public selectedAuthors = this.booksStore.selectedAuthors;
  public selectedCategories = this.booksStore.selectedCategories;
  public selectedPrices = this.booksStore.enteredPrices;

  sidebarVisible = signal(false);

  clearSelectedItems(filter: MultiSelectFilters) {
    this.booksStore.clearSelectedItems(filter);
  }

  clearSingleValueFilter(filter: SingleValueFilters) {
    this.booksStore.clearSingleValueFilter(filter);
  }

  clearPriceFilter() {
    this.booksStore.clearPrice();
  }
}
