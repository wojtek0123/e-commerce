import { Directive, inject } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';

@Directive({
  selector: 'p-sidebar[sidebarLeft]',
  standalone: true,
})
export class SidebarLeftDirective {
  private readonly sidebar = inject(Sidebar);

  constructor() {
    this.sidebar.style = {
      width: '100%',
      'max-width': '24rem',
      'border-top-right-radius': 'var(--border-radius)',
      'border-bottom-right-radius': 'var(--border-radius)',
    };
  }
}
