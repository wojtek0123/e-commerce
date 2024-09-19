import { Directive, inject } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';

@Directive({
  selector: 'p-toolbar[nav]',
  standalone: true,
})
export class NavToolbarDirective {
  private readonly toolbar = inject(Toolbar);

  constructor() {
    this.toolbar.style = {
      width: '100%',
      'max-width': '35rem',
      margin: '1rem auto',
      'border-radius': 'var(--border-radius)',
    };
  }
}
