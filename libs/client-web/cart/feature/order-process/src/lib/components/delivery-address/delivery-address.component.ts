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
import { UserAddress } from '@e-commerce/shared/api-models';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import {
  AddressInformationComponent,
  DeleteAddressConfirmationDialogComponent,
  ErrorAndRetryMessageComponent,
} from '@e-commerce/client-web/shared/ui';
import { DialogModule } from 'primeng/dialog';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';

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
    ErrorAndRetryMessageComponent,
  ],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryAddressComponent implements OnInit {
  #addressStore = inject(AddressStore);

  loading = this.#addressStore.loading;
  error = this.#addressStore.error;
  addresses = this.#addressStore.addresses;
  selectedAddressId = this.#addressStore.selectedAddressId;

  updatingAddress = this.#addressStore.updatingAddress;
  formType = this.#addressStore.formType;
  isFormVisible = this.#addressStore.formVisibility;

  isDeleteDialogVisible = this.#addressStore.isDeleteDialogVisible;

  isFormVisibleDelayedToResetForm = toSignal(
    toObservable(this.isFormVisible).pipe(delay(50)),
  );

  ngOnInit() {
    this.#addressStore.resetState();
  }

  getAddresses() {
    this.#addressStore.getAddresses();
  }

  showForm(address?: UserAddress) {
    this.#addressStore.showForm(address);
  }

  hideForm() {
    this.#addressStore.hideForm();
  }

  selectAddress(address: UserAddress) {
    this.#addressStore.selectAddress(address);
  }

  delete() {
    this.#addressStore.deleteAddress();
  }

  showDeleteDialog(address: UserAddress) {
    this.#addressStore.showDeleteDialog(address.id);
  }

  hideDeleteDialog() {
    this.#addressStore.hideDeleteDialog();
  }
}
