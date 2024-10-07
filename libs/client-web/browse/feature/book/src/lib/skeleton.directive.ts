import { Directive, inject } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Directive({
  selector: 'p-skeleton',
  standalone: true,
})
export class SkeletonDirective {
  private skeleton = inject(Skeleton);

  constructor() {
    this.skeleton.borderRadius = '1rem';
  }
}
