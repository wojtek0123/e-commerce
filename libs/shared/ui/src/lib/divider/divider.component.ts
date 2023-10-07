import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'e-commerce-divider',
  template: `<div
    class="bg-background-800"
    [ngClass]="{
      'w-full h-[0.05rem]': position === 'horizontal',
      'h-20 w-[0.05rem]': position === 'vertical'
    }"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class DividerComponent {
  @Input() position: 'vertical' | 'horizontal' = 'horizontal';
}
