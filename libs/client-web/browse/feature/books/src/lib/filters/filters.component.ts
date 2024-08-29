import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { AuthorFilterComponent } from './author-filter/author-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { TagFilterComponent } from './tag-filter/tag-filter.component';
import { PriceFilterComponent } from './price-filters/price-filters.component';

@Component({
  selector: 'lib-filters',
  standalone: true,
  imports: [
    AuthorFilterComponent,
    AccordionModule,
    CategoryFilterComponent,
    TagFilterComponent,
    PriceFilterComponent,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  @HostBinding('style.maxWidth') maxWidth = '24rem';
  @HostBinding('style.width') width = '100%';
}
