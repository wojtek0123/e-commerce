import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { AuthorFilterComponent } from './author-filter/author-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { TagFilterComponent } from './tag-filter/tag-filter.component';
import { PriceFilterComponent } from './price-filters/price-filters.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-filters',
  standalone: true,
  imports: [
    AuthorFilterComponent,
    AccordionModule,
    CategoryFilterComponent,
    TagFilterComponent,
    PriceFilterComponent,
    SidebarModule,
    ButtonModule,
    NgTemplateOutlet,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  @HostBinding('style.maxWidth') maximumWidth =
    window.innerWidth >= 1280 ? '26rem' : 'fit-content';
  @HostBinding('style.width') width =
    window.innerWidth >= 1280 ? '100%' : 'fit-content';

  @HostListener('window:resize')
  onResize() {
    console.log('here rer');
    if (window.innerWidth >= 1280) {
      this.maximumWidth = '26rem';
      this.width = '100%';
    } else {
      this.maximumWidth = 'fit-content';
      this.width = 'fit-content';
    }
  }

  sidebarVisible = signal(false);
}
