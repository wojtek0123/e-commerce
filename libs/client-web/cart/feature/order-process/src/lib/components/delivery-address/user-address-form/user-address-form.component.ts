import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/cart/data-access';
import { CreateUserAddressBody } from '@e-commerce/client-web/shared/data-access/api-services';
import { AddressFormComponent } from '@e-commerce/client-web/shared/feature';

@Component({
  selector: 'lib-user-address-form',
  standalone: true,
  imports: [AddressFormComponent],
  templateUrl: './user-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddressFormComponent {
  #addressStore = inject(AddressStore);

  loading = this.#addressStore.loading;

  formType = this.#addressStore.formType;
  isFormVisible = this.#addressStore.formVisibility;
  updatingAddress = this.#addressStore.updatingAddress;

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
