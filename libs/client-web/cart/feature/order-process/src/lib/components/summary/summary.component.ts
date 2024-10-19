import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  AddressStore,
  CartStore,
  OrderProcessStore,
  PaymentStore,
  ShippingStore,
} from '@e-commerce/client-web/cart/data-access';
import { DeliveryAddressComponent } from '../delivery-address/delivery-address.component';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { ShippingMethodComponent } from '../shipping-method/shipping-method.component';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-summary',
  standalone: true,
  imports: [
    CurrencyPipe,
    ButtonModule,
    DividerModule,
    DeliveryAddressComponent,
    PaymentMethodComponent,
    ShippingMethodComponent,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  private readonly orderProcessStore = inject(OrderProcessStore);
  private readonly cartStore = inject(CartStore);
  private readonly addressStore = inject(AddressStore);
  private readonly shippingStore = inject(ShippingStore);
  private readonly paymentStore = inject(PaymentStore);

  public cartItemsTotal = this.cartStore.total;
  public shippingMethodPrice = computed(
    () => this.shippingStore.selectedShipping()?.price ?? 0,
  );
  public total = computed(
    () => this.cartItemsTotal() + this.shippingMethodPrice(),
  );

  public userAddress = this.addressStore.selectedAddress;
  public shippingMethod = this.shippingStore.selectedShipping;
  public paymentMethod = this.paymentStore.selectedPayment;
  public initialLoading = computed(
    () =>
      this.addressStore.loading() ||
      this.shippingStore.loading() ||
      this.paymentStore.creditCard.loading(),
  );
  public isSixDigitCodeInvalid = signal(false);
  public isDeliveryAddressUpdating = signal(false);
  public creditCard = this.paymentStore.creditCard.data;
  public isPaymentInvalid = signal(false);
  public checkoutLoading = this.orderProcessStore.loading;
  private errors = computed(() => [
    this.isPaymentInvalid(),
    !this.userAddress(),
    !this.shippingMethod(),
  ]);

  protected submitted = signal(false);

  submit() {
    this.submitted.set(true);
    const address = this.userAddress();
    const selectedShippingMethod = this.shippingMethod();
    const selectedPaymentMethod = this.paymentMethod();

    if (!address || !selectedShippingMethod || !selectedPaymentMethod) return;

    if (this.errors().some((error) => error)) return;
    this.orderProcessStore.checkout({
      orderAddress: address,
      shippingMethodId: selectedShippingMethod.id,
      paymentMethod: selectedPaymentMethod,
    });
  }

  setDeliveryAddressState(state: boolean) {
    this.isDeliveryAddressUpdating.set(state);
  }
}
