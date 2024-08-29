import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-cart-item-sekeleton',
  template: `
    <div
      class="flex w-full justify-content-between surface-hover p-3 border-round"
    >
      <div class="flex gap-3">
        <p-skeleton width="8rem" height="8rem" />
        <div class="flex flex-column justify-content-between gap-3">
          <p-skeleton width="20rem" height="3rem" />
          <p-skeleton width="5.6rem" height="3rem" />
        </div>
      </div>
      <div class="flex flex-column justify-content-between gap-3 mt-4">
        <p-skeleton width="9rem" height="1.5rem" />
        <p-skeleton width="8.75rem" height="3.125rem" />
      </div>
    </div>
  `,
  standalone: true,
  imports: [SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemSkeletonComponent {}
