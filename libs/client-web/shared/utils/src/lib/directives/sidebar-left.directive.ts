import { Directive, inject } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';

@Directive({
  selector: 'p-sidebar[libSidebarLeft]',
  standalone: true,
})
export class SidebarLeftDirective {
  private readonly sidebar = inject(Sidebar);

  constructor() {
    this.sidebar.styleClass =
      'max-w-[40rem] w-full rounded-r-base bg-surface-100 dark:bg-surface-950';
  }
}
