import { Directive, input } from '@angular/core';

@Directive({
  selector: '[libOrderProcessItem]',
  standalone: true,
  host: {
    '[class.!border-primary]': 'isActive()',
    class:
      'border border-transparent p-4 rounded-base bg-surface-100 dark:bg-surface-950 w-full',
  },
})
export class OrderProcessItemDirective {
  isActive = input<boolean>();
}
