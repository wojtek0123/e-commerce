import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-section-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './section-wrapper.component.html',
  styleUrl: './section-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionWrapperComponent {
  header = input.required<string>();
}
