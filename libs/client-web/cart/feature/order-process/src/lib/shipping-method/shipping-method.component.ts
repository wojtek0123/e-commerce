import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Store } from '@ngrx/store';
import {
  orderProcessActions,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';
import { ReactiveFormsModule } from '@angular/forms';
import { ShippingMethod } from '@e-commerce/client-web/shared/data-access';
import { CurrencyPipe } from '@angular/common';
import {
  OrderProcessDetailElementComponent,
  SectionWrapperComponent,
} from '@e-commerce/client-web/cart/ui';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'lib-shipping-method',
  standalone: true,
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    OrderProcessDetailElementComponent,
    SectionWrapperComponent,
    SkeletonModule,
  ],
  templateUrl: './shipping-method.component.html',
  styleUrl: './shipping-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodComponent implements OnInit {
  private readonly store = inject(Store);

  public selectedShippingMethod = this.store.selectSignal(
    orderProcessSelectors.selectSelectedShippingMethod,
  );
  public shippingMethods = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethods,
  );
  public loading = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethodsLoading,
  );
  public error = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethodsError,
  );

  public ngOnInit(): void {
    this.store.dispatch(orderProcessActions.getShippingMethods());
  }

  public selectShippingMethod(shippingMethod: ShippingMethod) {
    this.store.dispatch(
      orderProcessActions.selectShippingMethod({ shippingMethod }),
    );
  }
}
