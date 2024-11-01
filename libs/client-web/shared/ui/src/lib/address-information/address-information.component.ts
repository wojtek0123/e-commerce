import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { UserAddress } from '@e-commerce/client-web/shared/data-access/api-models';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-address-information',
  templateUrl: './address-information.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderProcessItemDirective, ButtonModule],
})
export class AddressInformationComponent {
  public isActive = input<boolean>();
  public address = input.required<UserAddress | null>();

  public onSelect = output<UserAddress>();
  public onEdit = output<UserAddress>();
  public onDelete = output<UserAddress>();

  public select() {
    const address = this.address();

    if (!address) return;

    this.onSelect.emit(address);
  }

  public edit() {
    const address = this.address();

    if (!address) return;

    this.onEdit.emit(address);
  }

  public delete() {
    const address = this.address();

    if (!address) return;

    this.onDelete.emit(address);
  }
}
