import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-error-and-retry-message',
  imports: [Button],
  templateUrl: './error-and-retry-message.component.html',
  styleUrl: './error-and-retry-message.component.scss',
})
export class ErrorAndRetryMessageComponent {
  error = input.required<string | null>();
  unableToLoad = input<string>();

  onRetry = output<void>();

  retry() {
    this.onRetry.emit();
  }
}
