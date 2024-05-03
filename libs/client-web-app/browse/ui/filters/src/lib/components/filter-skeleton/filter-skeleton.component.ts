import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-filter-skeleton',
  template: `
    <div class="border-round">
      <p-skeleton
        class="border-round mb-2 flex align-items-center justify-content-center"
        width="50%"
        height="2rem"
      />
      <div
        class="w-full border border-round surface-border surface-card flex flex-column gap-2 py-3"
      >
        @for (_ of skeletons(); track $index) {
        <p-skeleton class="border-round mx-3" width="100%" height="3rem" />
        }
      </div>
    </div>
  `,
  standalone: true,
  imports: [SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSkeletonComponent {
  numberOfSkeletons = input.required<number>();

  skeletons = computed(() => new Array(this.numberOfSkeletons()));
}
