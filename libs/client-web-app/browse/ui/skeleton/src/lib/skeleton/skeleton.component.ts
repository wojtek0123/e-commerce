import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  template: `
    <div
      class="max-w-34rem border border-round surface-border surface-card flex flex-column mx-auto"
    >
      <p-skeleton
        class="border-round max-w-34rem"
        width="100%"
        height="14.5rem"
      />

      <div class="flex flex-column gap-4 p-4">
        <p-skeleton class="border-round" width="10rem" height="2rem" />
        <p-skeleton class="border-round" width="100%" height="5rem" />

        <p-skeleton
          class="border-round flex justify-content-end"
          width="50%"
          height="2.5rem"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  @HostBinding('class') class = 'w-full max-w-34rem';
}
