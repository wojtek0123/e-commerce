import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-book-card-skeleton',
  imports: [SkeletonModule],
  templateUrl: './book-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'max-w-[34rem] w-full',
  },
})
export class BookCardSkeletonComponent {}
