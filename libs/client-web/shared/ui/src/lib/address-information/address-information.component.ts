import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { UserAddress } from '@e-commerce/shared/api-models';
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
  isActive = input<boolean>();
  address = input.required<UserAddress | null>();
  clickable = input(true);
  removeable = input(true);

  selectEvent = output<void>();
  editEvent = output<void>();
  deleteEvent = output<void>();

  select() {
    this.selectEvent.emit();
  }

  edit() {
    this.editEvent.emit();
  }

  delete() {
    this.deleteEvent.emit();
  }
}
