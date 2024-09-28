import { Directive, inject } from '@angular/core';
import { Button } from 'primeng/button';

@Directive({
  selector: 'p-button[appNavButton]',
  standalone: true,
})
export class NavButtonDirective {
  private readonly button = inject(Button);

  constructor() {
    this.button.styleClass = 'h-[2.625rem] capitalize py-0';
    this.button.text = true;
    this.button.plain = true;
  }
}
