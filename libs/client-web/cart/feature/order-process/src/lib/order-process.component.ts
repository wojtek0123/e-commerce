import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { ShippingMethodComponent } from './components/shipping-method/shipping-method.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { OrderPriceSummaryComponent } from './components/order-price-summary/order-price-summary.component';
import { OrderCheckoutComponent } from './components/order-checkout/order-checkout.component';
import { OrderContainerComponent } from '@e-commerce/client-web/cart/ui';
import { CustomerInformationComponent } from './components/customer-information/customer-information.component';
import { OrderCartItemsComponent } from './components/order-cart-items/order-cart-items.component';

@Component({
  selector: 'lib-order-process',
  imports: [
    DeliveryAddressComponent,
    ShippingMethodComponent,
    PaymentMethodComponent,
    OrderPriceSummaryComponent,
    OrderCheckoutComponent,
    OrderCartItemsComponent,
    OrderContainerComponent,
    CustomerInformationComponent,
  ],
  templateUrl: './order-process.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProcessComponent {}
