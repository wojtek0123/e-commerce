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
import { UserAddress } from '@e-commerce/shared/api-models';
import { DialogModule } from 'primeng/dialog';
import { AccountDataAddressFormComponent } from '../address-form/address-form.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';

@Component({
  selector: 'lib-addresses',
  standalone: true,
  imports: [
    SkeletonModule,
    AddressInformationComponent,
    DialogModule,
    AccountDataAddressFormComponent,
    ButtonModule,
    ConfirmDialogModule,
    DeleteAddressConfirmationDialogComponent,
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
  isFormVisibleDelayedToResetForm = toSignal(
    toObservable(this.isFormVisible).pipe(delay(50)),
  );

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
