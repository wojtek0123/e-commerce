import { Directive, inject } from '@angular/core';
import { Drawer } from 'primeng/drawer';

@Directive({
  selector: 'p-drawer[libDrawerLeft]',
  standalone: true,
})
export class DrawerLeftDirective {
  #drawer = inject(Drawer);

  constructor() {
    this.#drawer.styleClass =
      this.#drawer.styleClass +
      ` max-w-[40rem] w-full rounded-r-base bg-surface-100 dark:bg-surface-950`;
    this.#drawer.blockScroll = true;
  }
}
