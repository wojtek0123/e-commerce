import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-error-message',
  standalone: true,
  template: `<small class="text-red-300">{{ message() }}</small>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  message = input<string>('Field is required');
}
