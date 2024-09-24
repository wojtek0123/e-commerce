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
import { Store } from '@ngrx/store';
import {
  BrowseState,
  selectSelectedAuthors,
  selectSelectedCategories,
  selectSelectedPrices,
  selectSelectedTags,
} from '@e-commerce/client-web/browse/data-access';
import { browseActions } from '@e-commerce/client-web/browse/data-access';
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
  private store = inject(Store);

  public selectedTags = this.store.selectSignal(selectSelectedTags);
  public selectedAuthors = this.store.selectSignal(selectSelectedAuthors);
  public selectedCategories = this.store.selectSignal(selectSelectedCategories);
  public selectedPrices = this.store.selectSignal(selectSelectedPrices);

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

  clearSelectedItems(filter: keyof BrowseState['filters']) {
    this.store.dispatch(browseActions.clearFilterSelectedItems({ filter }));
  }
}
