import { KeyValuePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { RatingModule } from 'primeng/rating';
import { ReviewFormDialogComponent } from '../review-form-dialog/review-form-dialog.component';

@Component({
  selector: 'lib-reviews-summary',
  imports: [
    RatingModule,
    FormsModule,
    KeyValuePipe,
    NgClass,
    ReviewFormDialogComponent,
  ],
  templateUrl: './reviews-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class ReviewsSummaryComponent {
  #bookStore = inject(BookStore);

  reviews = this.#bookStore.reviews;

  averageRating = computed(() => {
    const reviews = this.reviews();

    if (reviews.length === 0) return 0;

    return (
      reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
    ).toFixed(1);
  });

  groupedRating = computed(() =>
    this.reviews().reduce(
      (acc, review) => {
        acc[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
        return acc;
      },
      {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    ),
  );
}
