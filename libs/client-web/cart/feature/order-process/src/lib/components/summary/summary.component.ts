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
  public isCartEmpty = computed(() => this.cartStore.cartItems().length === 0);

  public selectedUserAddress = this.addressStore.selectedAddress;
  public selectedShippingMethod = this.shippingStore.selectedShipping;
  public selectedPaymentMethod = this.paymentStore.selectedPayment;
  public initialLoading = computed(
    () =>
      this.addressStore.loading() ||
      this.shippingStore.loading() ||
      this.paymentStore.creditCard.loading(),
  );
  public isSixDigitCodeInvalid = computed(
    () =>
      this.paymentStore.sixDigitCode()?.length !== 6 &&
      this.selectedPaymentMethod() === 'SIX_DIGIT_CODE',
  );
  public isAddressSelected = computed(
    () => !!this.addressStore.selectedAddress(),
  );
  public creditCard = this.paymentStore.creditCard.data;
  public isPaymentInvalid = signal(false);
  public checkoutLoading = this.orderProcessStore.loading;

  private orderProcessErrors = computed(() => [
    !this.selectedUserAddress(),
    !this.selectedShippingMethod(),
    !this.selectedPaymentMethod(),
    this.isSixDigitCodeInvalid() || !this.creditCard,
    this.isCartEmpty(),
  ]);

  protected submitted = signal(false);

  protected submit() {
    this.submitted.set(true);

    const selectedUserAddress = this.selectedUserAddress();
    const selectedShippingMethod = this.selectedShippingMethod();
    const selectedPaymentMethod = this.selectedPaymentMethod();

    if (
      !selectedUserAddress ||
      !selectedShippingMethod ||
      !selectedPaymentMethod
    )
      return;

    const isOrderProcessInvalid = this.orderProcessErrors().some(
      (error) => !!error,
    );

    if (isOrderProcessInvalid) return;

    this.orderProcessStore.checkout({
      orderAddress: selectedUserAddress,
      shippingMethodId: selectedShippingMethod.id,
      paymentMethod: selectedPaymentMethod,
    });
  }
}
