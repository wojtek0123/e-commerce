import { Directive, input } from '@angular/core';

@Directive({
  selector: '[libOrderProccessItem]',
  standalone: true,
  host: {
    '[class.border-primary]': 'isActive()',
    class:
      'border border-transparent flex items-center justify-between p-4 rounded-base bg-surface-100 dark:bg-surface-950 w-full cursor-pointer',
  },
})
export class OrderProcessItemDirective {
  isActive = input<boolean>();
}
