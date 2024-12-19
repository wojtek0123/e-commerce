import { Directive, inject, input } from '@angular/core';
import { Message } from 'primeng/message';

@Directive({
  selector: 'p-message[libErrorMessage]',
  standalone: true,
})
export class ErrorMessageDirective {
  #message = inject(Message);

  icon = input<string>();
  severity = input<'error' | 'success'>('error');
  variant = input<'simple' | 'outlined'>('simple');

  constructor() {
    this.#message.severity = this.severity();
    this.#message.size = 'small';
    this.#message.variant = this.variant();
    this.#message.icon = this.icon();
  }
}
