import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/account/data-access';
import {
  AddressInformationComponent,
  DeleteAddressConfirmationDialogComponent,
} from '@e-commerce/client-web/shared/ui';
import { SkeletonModule } from 'primeng/skeleton';
import { UserAddress } from '@e-commerce/client-web/shared/data-access/api-models';
import { DialogModule } from 'primeng/dialog';
import { AddressFormComponent } from '../address-form/address-form.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'lib-addresses',
  standalone: true,
  imports: [
    SkeletonModule,
    AddressInformationComponent,
    DialogModule,
    AddressFormComponent,
    ButtonModule,
    ConfirmDialogModule,
    DeleteAddressConfirmationDialogComponent,
  ],
  templateUrl: './addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent implements OnInit {
  private readonly addressesStore = inject(AddressStore);

  public loading = this.addressesStore.loading;
  public error = this.addressesStore.error;
  public addresses = this.addressesStore.addresses;

  public isFormVisible = computed(
    () => this.addressesStore.formInfo().isVisible,
  );
  public formType = this.addressesStore.formType;

  public isDeleteDialogVisible = this.addressesStore.isDeleteDialogVisible;

  public ngOnInit(): void {
    this.addressesStore.resetState();
  }

  public delete() {
    this.addressesStore.deleteAddress$();
  }

  public showForm(address?: UserAddress) {
    this.addressesStore.showForm(address);
  }

  public hideForm() {
    this.addressesStore.hideForm();
  }

  public showDeleteDialog(address: UserAddress) {
    this.addressesStore.showDeleteDialog(address.id);
  }

  public hideDeleteDialog() {
    this.addressesStore.hideDeleteDialog();
  }
}
