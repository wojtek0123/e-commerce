import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  untracked,
  viewChild,
} from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/account/data-access';
import {
  AddressInformationComponent,
  ConfirmationDialogComponent,
} from '@e-commerce/client-web/shared/ui';
import { SkeletonModule } from 'primeng/skeleton';
import { UserAddress } from '@e-commerce/shared/api-models';
import { DialogModule } from 'primeng/dialog';
import { AccountDataAddressFormComponent } from '../address-form/address-form.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'lib-addresses',
  imports: [
    SkeletonModule,
    AddressInformationComponent,
    DialogModule,
    AccountDataAddressFormComponent,
    ButtonModule,
    ConfirmDialogModule,
    ConfirmationDialogComponent,
  ],
  templateUrl: './addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent implements OnInit {
  #addressesStore = inject(AddressStore);

  loading = this.#addressesStore.loading;
  error = this.#addressesStore.error;
  addresses = this.#addressesStore.addresses;
  isDeleteDialogVisible = this.#addressesStore.isDeleteDialogVisible;
  formType = this.#addressesStore.formType;

  isFormVisible = computed(() => this.#addressesStore.formInfo().isVisible);

  addressFormRef = viewChild.required(AccountDataAddressFormComponent);

  constructor() {
    effect(() => {
      const isFormVisible = this.isFormVisible();

      untracked(() => {
        if (!isFormVisible) this.addressFormRef().formRef().form.reset();
      });
    });
  }

  ngOnInit(): void {
    this.#addressesStore.resetState();
  }

  delete() {
    this.#addressesStore.deleteAddress();
  }

  showForm(address?: UserAddress) {
    this.#addressesStore.showForm(address);
  }

  hideForm() {
    this.#addressesStore.hideForm();
  }

  showDeleteDialog(address: UserAddress) {
    this.#addressesStore.showDeleteDialog(address.id);
  }

  hideDeleteDialog() {
    this.#addressesStore.hideDeleteDialog();
  }
}
