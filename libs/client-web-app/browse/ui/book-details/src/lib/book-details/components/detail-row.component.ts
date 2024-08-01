import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-detail-row',
  template: `
    <div class="flex align-items-center gap-2">
      <span class="text-color-secondary font-semibold w-8rem">{{
        label()
      }}</span>
      <div class="text-2xl">{{ value() ?? 'Undefined' }}</div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailRowComponent {
  label = input.required<string>();
  value = input.required<string | number | boolean | null>();
}
