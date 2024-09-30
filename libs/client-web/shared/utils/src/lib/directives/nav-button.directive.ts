import { Directive, inject } from '@angular/core';
import { Button } from 'primeng/button';

@Directive({
  selector: 'p-button[libNavButton]',
  standalone: true,
})
export class NavButtonDirective {
  private readonly button = inject(Button);

  constructor() {
    this.button.styleClass = 'h-[2.625rem] capitalize py-0 text-muted-color';
    this.button.text = true;
    this.button.plain = true;
  }
}