import { Directive, inject } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';

@Directive({
  selector: 'p-toolbar[appNavToolbar]',
  standalone: true,
})
export class NavToolbarDirective {
  private readonly toolbar = inject(Toolbar);

  constructor() {
    this.toolbar.style = {
      width: '100%',
      margin: '0 auto',
      'border-top-left-radius': 'var(--border-radius)',
      'border-top-right-radius': 'var(--border-radius)',
      'border-bottom-left-radius': 0,
      'border-bottom-right-radius': 0,
    };
  }
}
