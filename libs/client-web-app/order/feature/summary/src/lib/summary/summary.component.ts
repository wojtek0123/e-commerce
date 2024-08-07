import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { StepService } from '@e-commerce/client-web-app/order/data-access';
import {
  OrderDetailsApiService,
  ShippingMethodApiService,
  ShoppingSessionApiService,
  UserAddressApiService,
} from '@e-commerce/client-web-app/shared/data-access/api-services';
import { catchError, ignoreElements, take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {
  ResponseError,
  ShippingMethod,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/stores';
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
} from '@e-commerce/client-web-app/shared/ui/form-field';
import { InputMaskModule } from 'primeng/inputmask';

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
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  private userAddressApi = inject(UserAddressApiService);
  private stepService = inject(StepService);
  private orderDetailsApi = inject(OrderDetailsApiService);
  private shoppingSessionApi = inject(ShoppingSessionApiService);
  private shippingMethodApi = inject(ShippingMethodApiService);
  private cartService = inject(CartService);
  private router = inject(Router);

  loading = signal(false);

  addressInformation$ = this.userAddressApi.getUserAddress();
  addressInformationError$ = this.addressInformation$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );

  shippingMethods$ = this.shippingMethodApi.getShippingMethods$();
  shippingMethodsError$ = this.shippingMethods$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );

  selectedShippingMethod = new FormControl<ShippingMethod | null>(
    null,
    Validators.required,
  );
  selectedPaymentMethod = new FormControl<string | null>(
    null,
    Validators.required,
  );

  cartItemsTotal = this.cartService.total;
  shippingPrice = computed(
    () => this.stepService.orderInformation().shippingMethod?.price ?? 0,
  );
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
