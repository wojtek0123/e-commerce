import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-error-message',
  standalone: true,
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  message = input<string>('This field is required');
}
