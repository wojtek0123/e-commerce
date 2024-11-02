import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'lib-delete-address-confirmation-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './delete-confirmation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAddressConfirmationDialogComponent {
  public isVisible = input.required<boolean>();
  public loading = input<boolean>();

  public onDelete = output<void>();
  public onHide = output<void>();
}
