import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { ShippingMethodComponent } from './components/shipping-method/shipping-method.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { OrderPriceComponent } from './components/order-price/order-price.component';
import { OrderCheckoutComponent } from './components/order-checkout/order-checkout.component';
import { CartItemsComponent } from './components/cart-items/cart-items.component';

@Component({
  selector: 'lib-order-process',
  imports: [
    DeliveryAddressComponent,
    ShippingMethodComponent,
    PaymentMethodComponent,
    OrderPriceComponent,
    OrderCheckoutComponent,
    CartItemsComponent,
  ],
  templateUrl: './order-process.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProcessComponent {}
