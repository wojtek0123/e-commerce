import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-cart-item-sekeleton',
  template: `
    <div class="flex flex-column w-full surface-card p-3 border-round">
      <div class="flex align-items-center justify-content-between gap-3">
        <p-skeleton width="20rem" height="2.215rem" />
        <p-skeleton width="5.6rem" height="2.125rem" />
      </div>
      <div class="flex align-items-center justify-content-between gap-3 mt-4">
        <div clas="flex flex-wrap">
          <p-skeleton width="9rem" height="1.5rem" />
        </div>
        <div class="flex align-items-center">
          <p-skeleton width="8.75rem" height="2.625rem" />
          <p-skeleton width="3rem" height="2.625rem" />
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemSkeletonComponent {}
