import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-cart-item-sekeleton',
  template: `
    <div
      class="flex w-full items-center justify-between bg-content-background p-base rounded-base @container"
    >
      <div class="flex items-center gap-base w-full">
        <p-skeleton height="8rem" class="max-w-32 w-full min-w-20" />
        <div
          class="flex flex-col justify-between gap-base w-full @6xl:grid @6xl:grid-cols-[1fr_0.7fr] @6xl:items-center"
        >
          <p-skeleton
            width="100%"
            height="3rem"
            class="@2xl:max-w-full @6xl:max-w-80"
          />
          <p-skeleton
            width="100%"
            height="2.5rem"
            class="@xl:max-w-[65%] @6xl:max-w-64"
          />
        </div>
        <div
          class="hidden flex-col justify-between items-end gap-base w-full @2xl:flex @4xl:flex-row @4xl:justify-end @4xl:items-center"
        >
          <p-skeleton width="9rem" height="2rem" />
          <p-skeleton width="8.75rem" height="3rem" />
        </div>
      </div>
    </div>
  `,
  imports: [SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full',
  },
})
export class CartItemSkeletonComponent {}
