import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/cart/data-access';
import { UserAddressFormComponent } from './user-address-form/user-address-form.component';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { UserAddress } from '@e-commerce/client-web/shared/data-access/api-models';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import {
  AddressInformationComponent,
  DeleteAddressConfirmationDialogComponent,
} from '@e-commerce/client-web/shared/ui';
import { DialogModule } from 'primeng/dialog';

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
    DeleteAddressConfirmationDialogComponent,
    DialogModule,
  ],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryAddressComponent implements OnInit {
  private readonly addressStore = inject(AddressStore);

  public loading = this.addressStore.loading;
  public error = this.addressStore.error;
  public addresses = this.addressStore.addresses;
  public selectedAddressId = this.addressStore.selectedAddressId;

  public updatingAddress = this.addressStore.updatingAddress;
  public formType = this.addressStore.formType;
  public isFormVisible = this.addressStore.formVisibility;

  public isDeleteDialogVisible = this.addressStore.isDeleteDialogVisible;

  public ngOnInit(): void {
    this.addressStore.resetState();
  }

  public showForm(address?: UserAddress) {
    this.addressStore.showForm(address);
  }

  public hideForm() {
    this.addressStore.hideForm();
  }

  public selectAddress(address: UserAddress) {
    this.addressStore.selectAddress(address);
  }

  public delete() {
    this.addressStore.deleteAddress$();
  }

  public showDeleteDialog(address: UserAddress) {
    this.addressStore.showDeleteDialog(address.id);
  }

  public hideDeleteDialog() {
    this.addressStore.hideDeleteDialog();
  }
}
