import { afterNextRender, Directive, inject } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';

@Directive({
  selector: 'p-sidebar[appSidebarLeft]',
  standalone: true,
})
export class SidebarLeftDirective {
  private readonly sidebar = inject(Sidebar);
  private readonly minWidth = 568;

  constructor() {
    this.sidebar.style = {
      width: '100%',
    };

    afterNextRender(() => {
      if (window.innerWidth >= this.minWidth) {
        // Object.assign(this.sidebar.style, {
        //   'max-width': '24rem',
        //   'border-top-right-radius': 'var(--border-radius)',
        //   'border-bottom-right-radius': 'var(--border-radius)',
        // });
      }

      window.addEventListener('resize', () => {
        if (!this.sidebar.style) return;

        if (window.innerWidth >= this.minWidth) {
          Object.assign(this.sidebar.style, {
            'max-width': '24rem',
            'border-top-right-radius': 'var(--border-radius)',
            'border-bottom-right-radius': 'var(--border-radius)',
          });
        } else {
          delete this.sidebar.style['max-width'];
          delete this.sidebar.style['border-top-right-radius'];
          delete this.sidebar.style['border-bottom-right-radius'];
        }
      });
    });
  }
}
