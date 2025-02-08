import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-section-wrapper',
  templateUrl: './section-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionWrapperComponent {
  header = input.required<string>();
}
