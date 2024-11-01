import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/account/data-access';
import {
  AddressInformationComponent,
  DeleteConfirmationDialogComponent,
} from '@e-commerce/client-web/shared/ui';
import { SkeletonModule } from 'primeng/skeleton';
import { UserAddress } from '@e-commerce/client-web/shared/data-access/api-models';
import { DialogModule } from 'primeng/dialog';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgClass } from '@angular/common';

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
    NgClass,
    DeleteConfirmationDialogComponent,
  ],
  templateUrl: './addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent {
  private readonly addressesStore = inject(AddressStore);

  public loading = this.addressesStore.loading;
  public error = this.addressesStore.error;
  public addresses = this.addressesStore.addresses;

  public isFormVisible = computed(
    () => this.addressesStore.formInfo().isVisible,
  );
  public formType = this.addressesStore.formType;
  public isFormTypeDelete = computed(() => this.formType() === 'delete');

  public delete() {
    this.addressesStore.deleteAddress$();
  }

  public showForm(type: 'add' | 'update' | 'delete', address?: UserAddress) {
    this.addressesStore.showForm(type, address);
  }

  public hideForm() {
    this.addressesStore.hideForm();
  }
}
