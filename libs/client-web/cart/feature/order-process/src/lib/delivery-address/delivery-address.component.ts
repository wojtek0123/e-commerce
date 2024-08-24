import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  orderProcessActions,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';
import { UserAddressFormComponent } from './user-address-form/user-address-form.component';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';

@Component({
  selector: 'lib-delivery-address',
  standalone: true,
  imports: [UserAddressFormComponent, SectionWrapperComponent],
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryAddressComponent implements OnInit {
  private readonly store = inject(Store);

  loading = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressLoading,
  );
  error = this.store.selectSignal(orderProcessSelectors.selectUserAddressError);
  userAddress = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressData,
  );

  ngOnInit(): void {
    this.store.dispatch(orderProcessActions.getUserAddress());
  }
}
