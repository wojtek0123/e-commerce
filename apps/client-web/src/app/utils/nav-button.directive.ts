import { Directive, inject } from '@angular/core';
import { Button } from 'primeng/button';

@Directive({
  selector: 'p-button[appNavButton]',
  standalone: true,
})
export class NavButtonDirective {
  private readonly button = inject(Button);

  constructor() {
    this.button.style = {
      padding: '0.5rem 1rem',
      'text-transform': 'capitalize',
    };
    this.button.text = true;
    this.button.plain = true;
  }
}
