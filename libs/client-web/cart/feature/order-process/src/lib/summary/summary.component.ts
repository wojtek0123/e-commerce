import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ShoppingSessionApiService } from '@e-commerce/client-web/shared/data-access';
import { take } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShippingMethod } from '@e-commerce/client-web/shared/data-access';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import {
  ErrorMessageComponent,
  FormFieldComponent,
} from '@e-commerce/client-web/shared/ui';
import { InputMaskModule } from 'primeng/inputmask';
import { Store } from '@ngrx/store';
import {
  cartSelectors,
  orderProcessSelectors,
} from '@e-commerce/client-web/cart/data-access';
import { DeliveryAddressComponent } from '../delivery-address/delivery-address.component';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';
import { ShippingMethodComponent } from '../shipping-method/shipping-method.component';

@Component({
  selector: 'lib-summary',
  standalone: true,
  imports: [
    InputMaskModule,
    CurrencyPipe,
    ButtonModule,
    RouterLink,
    DividerModule,
    AsyncPipe,
    RadioButtonModule,
    ReactiveFormsModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    ErrorMessageComponent,
    FormFieldComponent,
    DeliveryAddressComponent,
    PaymentMethodComponent,
    ShippingMethodComponent,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  private readonly store = inject(Store);
  private shoppingSessionApi = inject(ShoppingSessionApiService);

  loading = signal(false);

  userAddress = this.store.selectSignal(
    orderProcessSelectors.selectUserAddress,
  );
  userAddressLoading = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressLoading,
  );
  userAddressError = this.store.selectSignal(
    orderProcessSelectors.selectUserAddressError,
  );

  shippingMethods = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethods,
  );
  shippingMethodsError = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethodsError,
  );
  shippingMethodsLoading = this.store.selectSignal(
    orderProcessSelectors.selectShippingMethodsLoading,
  );

  selectedShippingMethod = new FormControl<ShippingMethod | null>(
    null,
    Validators.required,
  );
  selectedPaymentMethod = new FormControl<string | null>(
    null,
    Validators.required,
  );

  cartItemsTotal = this.store.selectSignal(cartSelectors.selectTotal);
  shippingPrice = computed(() => this.selectedShippingMethod.value?.price ?? 0);
  total = computed(() => this.cartItemsTotal() + this.shippingPrice());

  protected submitted = signal(false);
  protected form = new FormGroup({
    cardNumber: new FormControl<string | null>(null, Validators.required),
    expirationDate: new FormControl<string | null>(null, Validators.required),
    securityCode: new FormControl<string | null>(null, Validators.required),
  });

  submit() {
    // if (!this.addressInformation() || !this.shippingMethod()) return;
    //
    // this.orderDetailsApi
    //   .create({
    //     shippingMethodId: this.shippingMethod()!.id,
    //     userAddressId: this.addressInformation()!.id,
    //   })
    //   .pipe(take(1))
    //   .subscribe({
    //     next: async () => {
    //       this.loading.set(false);
    //       this.deleteShoppingSession();
    //       await this.router.navigate(['/order/payment-status']);
    //     },
    //     error: (resError: ResponseError) => {
    //       this.loading.set(false);
    //       console.error(resError.error.message);
    //     },
    //   });
    //
  }

  private deleteShoppingSession() {
    this.shoppingSessionApi.delete().pipe(take(1)).subscribe();
  }
}
