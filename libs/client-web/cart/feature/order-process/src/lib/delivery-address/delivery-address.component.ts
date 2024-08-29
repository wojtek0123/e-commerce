import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  orderProcessActions,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';
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
export class DeliveryAddressComponent implements OnInit {
  private readonly store = inject(Store);

  public loading = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressLoading,
  );
  public error = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressError,
  );
  public userAddress = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressData,
  );

  public formType = signal<'add' | 'update' | null>(
    !this.userAddress ? 'add' : null,
  );
  public isUpdatingEvent = output<boolean>();

  constructor() {
    effect(() => {
      this.isUpdatingEvent.emit(this.formType() === 'update');
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(orderProcessActions.getUserAddress());
  }

  public updateDeliveryAddress() {
    this.formType.set('update');
  }
}
