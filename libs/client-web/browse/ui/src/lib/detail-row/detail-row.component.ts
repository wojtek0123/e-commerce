import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-detail-row',
  templateUrl: './detail-row.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailRowComponent {
  label = input.required<string>();
  value = input.required<string | number | boolean | null>();
}
