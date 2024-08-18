import { Directive, HostBinding, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[libCustomFilter]',
  standalone: true,
})
export class CustomFilterDirective {
  @HostBinding('style.padding') padding = '1rem';
}
