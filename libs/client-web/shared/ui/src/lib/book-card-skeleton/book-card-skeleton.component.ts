import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-book-card-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './book-card-skeleton.component.html',
  styleUrl: './book-card-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCardSkeletonComponent {
  @HostBinding('style.maxWidth') maxWidth = '34rem';
  @HostBinding('style.width') width = '100%';
}
