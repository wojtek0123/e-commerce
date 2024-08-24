import { Component, inject, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Store } from '@ngrx/store';
import {
  orderProcessActions,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingMethod } from '@e-commerce/client-web/shared/data-access';
import { CurrencyPipe } from '@angular/common';
import {
  OrderProcessDetailElementComponent,
  SectionWrapperComponent,
} from '@e-commerce/client-web/cart/ui';

@Component({
  selector: 'lib-shipping-method',
  standalone: true,
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    OrderProcessDetailElementComponent,
    SectionWrapperComponent,
  ],
  templateUrl: './shipping-method.component.html',
  styleUrl: './shipping-method.component.scss',
})
export class ShippingMethodComponent implements OnInit {
  private readonly store = inject(Store);

  public shippingMethods = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethods,
  );
  public loading = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethodsLoading,
  );
  public error = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethodsError,
  );

  protected selectedShippingMethod = new FormControl<ShippingMethod | null>(
    null,
    Validators.required,
  );

  public ngOnInit(): void {
    this.store.dispatch(orderProcessActions.getShippingMethods());
  }

  public selectShippingMethod(method: ShippingMethod) {
    this.selectedShippingMethod.setValue(method);
  }
}
