import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import { AddressStore } from '@e-commerce/client-web/cart/data-access';
import { UserAddressFormComponent } from './user-address-form/user-address-form.component';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-delivery-address',
  standalone: true,
  imports: [
    UserAddressFormComponent,
    SectionWrapperComponent,
    ButtonModule,
    SkeletonModule,
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

  public formType = signal<'add' | 'update' | null>('add');
  public isUpdatingEvent = output<boolean>();

  constructor() {
    effect(() => {
      this.isUpdatingEvent.emit(this.formType() === 'update');
    });
  }

  public updateDeliveryAddress() {
    this.formType.set('update');
  }
}
