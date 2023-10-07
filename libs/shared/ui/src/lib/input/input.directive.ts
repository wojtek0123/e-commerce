import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[eCommerceInput]',
  standalone: true,
})
export class InputDirective {
  @HostBinding('class') class = 'rounded-3xl px-4 py-1';
}
