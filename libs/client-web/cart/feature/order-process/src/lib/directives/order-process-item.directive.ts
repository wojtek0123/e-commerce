import { Directive, input } from '@angular/core';

@Directive({
  selector: '[libOrderProccessItem]',
  standalone: true,
  host: {
    '[class.border-blue-400]': 'isActive()',
    class:
      'border border-transparent p-4 rounded-base bg-surface-100 dark:bg-surface-950 w-full',
  },
})
export class OrderProcessItemDirective {
  isActive = input<boolean>();
}
