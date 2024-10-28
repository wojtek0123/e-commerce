import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/cart/data-access';
import { UserAddressFormComponent } from './user-address-form/user-address-form.component';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { UserAddress } from '@e-commerce/client-web/shared/data-access';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { AddressInformationComponent } from '@e-commerce/client-web/shared/ui';

@Component({
  selector: 'lib-delivery-address',
  standalone: true,
  imports: [
    UserAddressFormComponent,
    SectionWrapperComponent,
    ButtonModule,
    SkeletonModule,
    OrderProcessItemDirective,
    AddressInformationComponent,
  ],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryAddressComponent {
  private readonly addressStore = inject(AddressStore);

  public loading = this.addressStore.loading;
  public error = this.addressStore.error;
  public addresses = this.addressStore.addresses;
  public selectedAddressId = this.addressStore.selectedAddressId;

  public updatingAddress = this.addressStore.updatingAddress;
  public formType = this.addressStore.formType;
  public formVisibility = this.addressStore.formVisibility;

  public showForm(address?: UserAddress) {
    this.addressStore.showForm(address);
  }

  public hideForm() {
    this.addressStore.hideForm();
  }

  public selectAddress(address: UserAddress) {
    this.addressStore.selectAddress(address);
  }

  public deleteAddress(id: UserAddress['id']) {
    this.addressStore.deleteAddress$({ id });
  }
}
