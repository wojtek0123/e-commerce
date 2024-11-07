import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'lib-order-process-detail-element',
  standalone: true,
  imports: [CurrencyPipe, NgClass],
  templateUrl: './order-process-detail-element.component.html',
  styleUrl: './order-process-detail-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.border-primary-400]': 'isActive()',
    class:
      'border border-transparent flex items-center justify-between p-4 rounded-base bg-surface-100 dark:bg-surface-950 w-full cursor-pointer',
  },
})
export class OrderProcessDetailElementComponent<T> {
  isActive = input.required<boolean>();

  clickEvent = output<T>();
}
