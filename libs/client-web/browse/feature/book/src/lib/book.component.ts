import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BookDetails } from '@e-commerce/shared/api-models';
import { SkeletonModule } from 'primeng/skeleton';
import { SkeletonDirective } from './directives/skeleton.directive';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { ReviewsSummaryComponent } from './components/reviews-summary/reviews-summary.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { PriceSectionComponent } from './components/price-section/price-section.component';
import { SectionHeaderDirective } from './directives/section-header.directive';

@Component({
  selector: 'lib-book',
  standalone: true,
  imports: [
    ButtonModule,
    SkeletonModule,
    SkeletonDirective,
    TooltipModule,
    NgOptimizedImage,
    RatingModule,
    ReviewsComponent,
    ReviewsSummaryComponent,
    BookDetailsComponent,
    PriceSectionComponent,
    SectionHeaderDirective,
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  #bookStore = inject(BookStore);

  book = this.#bookStore.book;
  loading = this.#bookStore.loading;
  error = this.#bookStore.error;

  bookId = input.required<BookDetails['id']>();

  constructor() {
    effect(() => {
      const bookId = this.bookId();

      untracked(() => {
        this.#bookStore.getBook({ bookId });
      });
    });
  }

  getBook() {
    const bookId = this.bookId();

    this.#bookStore.getBook({ bookId });
  }
}
