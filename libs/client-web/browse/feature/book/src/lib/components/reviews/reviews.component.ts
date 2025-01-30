import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookStore } from '@e-commerce/client-web/browse/data-access';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'lib-reviews',
  imports: [RatingModule, FormsModule, DatePipe],
  templateUrl: './reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent {
  #bookStore = inject(BookStore);

  reviews = this.#bookStore.reviews;
}
