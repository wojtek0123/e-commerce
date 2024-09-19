import { Directive, inject } from '@angular/core';
import { Button } from 'primeng/button';

@Directive({
  selector: 'p-button[navButton]',
  standalone: true,
})
export class NavButtonDirective {
  private readonly button = inject(Button);

  constructor() {
    this.button.style = {
      width: '100%',
      'text-align': 'left',
    };
    this.button.text = true;
    this.button.plain = true;
  }
}
