import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { DetailRowComponent } from '@e-commerce/client-web/browse/ui';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Tag } from 'primeng/tag';
import { PriceSectionComponent } from '../price-section/price-section.component';
import { MenuItem } from 'primeng/api';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { SectionHeaderDirective } from '../../directives/section-header.directive';
import { BookTagToSeverityPipe } from '@e-commerce/client-web/shared/utils';

@Component({
  selector: 'lib-book-details',
  imports: [
    Breadcrumb,
    DetailRowComponent,
    NgOptimizedImage,
    Tag,
    DatePipe,
    PriceSectionComponent,
    SectionHeaderDirective,
    BookTagToSeverityPipe,
  ],
  templateUrl: './book-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent {
  #bookStore = inject(BookStore);
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  book = this.#bookStore.book;

  breadcrumbs = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/' },
    {
      label: 'books',
      routerLink: this.#appRoutePaths.BOOKS(),
    },
    { label: this.book()?.title },
  ]);
}
