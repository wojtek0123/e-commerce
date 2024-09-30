import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PriceFilterComponent } from './price-filters/price-filters.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { NgTemplateOutlet } from '@angular/common';
import {
  BooksState,
  BooksStore,
} from '@e-commerce/client-web/browse/data-access';
import {
  AccordionFilterHeaderComponent,
  SelectItemsFilterComponent,
} from '@e-commerce/client-web/browse/ui';
import { AuthorsDirective } from './directives/authors.directive';
import { FilterComponent } from './filter/filter.component';
import { CategoriesDirective } from './directives/category.directive';
import { TagsDirective } from './directives/tags.directive';

@Component({
  selector: 'lib-filters',
  standalone: true,
  imports: [
    AccordionModule,
    PriceFilterComponent,
    SidebarModule,
    ButtonModule,
    NgTemplateOutlet,
    AccordionFilterHeaderComponent,
    SelectItemsFilterComponent,
    FilterComponent,
    AuthorsDirective,
    CategoriesDirective,
    TagsDirective,
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

  @HostBinding('style.maxWidth') maximumWidth =
    window.innerWidth >= 1280 ? '20rem' : 'fit-content';
  @HostBinding('style.width') width =
    window.innerWidth >= 1280 ? '100%' : 'fit-content';

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1280) {
      this.maximumWidth = '20rem';
      this.width = '100%';
    } else {
      this.maximumWidth = 'fit-content';
      this.width = 'fit-content';
    }
  }

  sidebarVisible = signal(false);

  clearSelectedItems(filter: keyof BooksState['filters']) {
    this.booksStore.clearSelectedItems(filter);
  }
}
