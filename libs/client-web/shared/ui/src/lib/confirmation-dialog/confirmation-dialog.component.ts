import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'lib-confirmation-dialog',
  imports: [DialogModule, ButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  isVisible = input.required<boolean>();
  header = input.required<string>();
  loading = input<boolean>();

  confirmed = output<void>();
  canceled = output<void>();

  cancel() {
    this.canceled.emit();
  }

  confirm() {
    this.confirmed.emit();
  }
}
