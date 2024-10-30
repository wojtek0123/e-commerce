import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/account/data-access';
import { AddressInformationComponent } from '@e-commerce/client-web/shared/ui';
import { SkeletonModule } from 'primeng/skeleton';
import { UserAddress } from '@e-commerce/client-web/shared/data-access/api-models';
import { DialogModule } from 'primeng/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-addresses',
  standalone: true,
  imports: [
    SkeletonModule,
    AddressInformationComponent,
    DialogModule,
    NgTemplateOutlet,
    AddressFormComponent,
    ButtonModule,
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
    () => this.addressesStore.formInfo().visibility,
  );

  public update(address: UserAddress) {
    this.addressesStore.showForm(address);
  }

  public delete(id: UserAddress['id']) {
    this.addressesStore.deleteAddress$({ id });
  }

  public add() {
    this.addressesStore.showForm();
  }

  public hideForm() {
    this.addressesStore.hideForm();
  }
}
