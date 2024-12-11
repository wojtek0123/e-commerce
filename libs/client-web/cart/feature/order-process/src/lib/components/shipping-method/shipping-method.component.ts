import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ShippingStore } from '@e-commerce/client-web/cart/data-access';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { SectionWrapperComponent } from '@e-commerce/client-web/cart/ui';
import { SkeletonModule } from 'primeng/skeleton';
import { OrderProcessItemDirective } from '@e-commerce/client-web/shared/utils';
import { ShippingMethod } from '@e-commerce/client-web/shared/data-access/api-models';

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
  styleUrl: './shipping-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodComponent {
  private readonly shippingStore = inject(ShippingStore);

  public selectedShipping = this.shippingStore.selectedShipping;
  public shippings = this.shippingStore.shippings;
  public loading = this.shippingStore.loading;
  public error = this.shippingStore.error;

  public selectShipping(shipping: ShippingMethod) {
    this.shippingStore.selectShipping(shipping);
  }
}
