import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/account/data-access';
import { CreateUserAddressBody } from '@e-commerce/client-web/shared/data-access/api-services';
import { AddressFormComponent } from '@e-commerce/client-web/shared/feature';

@Component({
  selector: 'lib-account-data-address-form',
  standalone: true,
  templateUrl: './address-form.component.html',
  imports: [AddressFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDataAddressFormComponent {
  #addressStore = inject(AddressStore);

  formType = this.#addressStore.formType;
  loading = this.#addressStore.loading;
  updatingAddress = this.#addressStore.updatingAddress;
  isFormVisible = this.#addressStore.formVisibility;

  formRef = viewChild.required(AddressFormComponent);

  cancel() {
    this.#addressStore.hideForm();
  }

  add(formValues: CreateUserAddressBody) {
    this.#addressStore.addAddress({ data: formValues });
  }

  edit(formValues: CreateUserAddressBody) {
    this.#addressStore.updateAddress({ data: formValues });
  }
}
