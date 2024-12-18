import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ShippingStore } from '@e-commerce/client-web/cart/data-access';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';
import { SkeletonModule } from 'primeng/skeleton';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { ShippingMethod } from '@e-commerce/shared/api-models';

@Component({
  selector: 'lib-shipping-method',
  standalone: true,
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    SectionWrapperComponent,
    SkeletonModule,
    OrderProcessItemDirective,
  ],
  templateUrl: './shipping-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodComponent {
  #shippingStore = inject(ShippingStore);

  selectedShipping = this.#shippingStore.selectedShipping;
  shippings = this.#shippingStore.shippings;
  loading = this.#shippingStore.loading;
  error = this.#shippingStore.error;

  selectShipping(shipping: ShippingMethod) {
    this.#shippingStore.selectShipping(shipping);
  }
}
