import { Component, inject, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  OrderDetailsInfo,
  Step,
} from '@e-commerce/client-web-app/order/data-access';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { Router, RouterLink } from '@angular/router';
import {
  OrderDetailsApiService,
  ShoppingSessionApiService,
} from '@e-commerce/client-web-app/shared/data-access/api-services';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { take } from 'rxjs';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/cart';

@Component({
  selector: 'lib-order-payment',
  standalone: true,
  imports: [
    ButtonModule,
    NgClass,
    InputTextModule,
    InputMaskModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <form [formGroup]="form" class="flex flex-column gap-2">
      <div class="flex flex-column w-full">
        <div class="flex flex-column gap-1">
          <label for="card-number">Card number *</label>
          <p-inputMask
            mask="9999 9999 9999 9999"
            class="w-full"
            id="card-number"
            [ngClass]="{
              'ng-invalid ng-dirty':
                form.controls.cardNumber.invalid &&
                (form.controls.cardNumber.dirty || form.dirty)
            }"
            formControlName="cardNumber"
            placeholder="Type your card number"
          />
        </div>
        @if (form.controls.cardNumber.invalid && (form.controls.cardNumber.dirty
        || form.dirty)) {
        <small class="text-red-500 mt-1">This field is required</small>
        }
      </div>

      <div class="flex align-items-center gap-3">
        <div class="flex flex-column w-full">
          <div class="flex flex-column gap-1 w-full">
            <label for="expiration-date">Expiration date *</label>
            <p-inputMask
              mask="99/9999"
              class="w-full"
              id="expiration-date"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  form.controls.expirationDate.invalid &&
                  (form.controls.expirationDate.dirty || form.dirty)
              }"
              formControlName="expirationDate"
              placeholder="Type expiration date"
            />
          </div>
          @if (form.controls.expirationDate.invalid &&
          (form.controls.expirationDate.dirty || form.dirty)) {
          <small class="text-red-500 mt-1">This field is required</small>
          }
        </div>

        <div class="flex flex-column w-full">
          <div class="flex flex-column gap-1">
            <label for="expiration-date">Security code *</label>
            <p-inputMask
              mask="999"
              class="w-full"
              id="security-code"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  form.controls.securityCode.invalid &&
                  (form.controls.securityCode.dirty || form.dirty)
              }"
              formControlName="securityCode"
              placeholder="Type security code"
            />
          </div>
          @if (form.controls.securityCode.invalid &&
          (form.controls.securityCode.dirty || form.dirty)) {
          <small class="text-red-500 mt-1">This field is required</small>
          }
        </div>
      </div>
    </form>

    <div class="flex align-items-center justify-content-between gap-3 mt-6">
      <p-button
        [outlined]="true"
        icon="pi pi-arrow-left"
        label="Back to shipping"
        (onClick)="changeStepEvent.emit({ step: 'shipping' })"
      />
      <p-button
        icon="pi pi-arrow-right"
        iconPos="right"
        label="Pay"
        [loading]="loading()"
        (onClick)="submit()"
      />
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-inputmask {
          width: 100%;
        }
      }
    `,
  ],
})
export class OrderPaymentComponent {
  private router = inject(Router);
  private orderDetailsApi = inject(OrderDetailsApiService);
  private shoppingSessionApi = inject(ShoppingSessionApiService);
  private cart = inject(CartService);

  changeStepEvent = output<{ step: Step }>();

  orderDetails = input.required<OrderDetailsInfo>();

  loading = signal(false);
  form = new FormGroup({
    cardNumber: new FormControl(null, Validators.required),
    expirationDate: new FormControl(null, Validators.required),
    securityCode: new FormControl(null, Validators.required),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAsDirty();
      return;
    }

    const { userAddressId, shippingMethodId } = this.orderDetails();

    if (!userAddressId || !shippingMethodId) return;

    this.loading.set(true);

    this.orderDetailsApi
      .create({
        shippingMethodId: shippingMethodId,
        userAddressId: userAddressId,
      })
      .pipe(take(1))
      .subscribe({
        next: async () => {
          this.loading.set(false);
          this.deleteShoppingSession();
          // this.cart.getShoppingSession();
          await this.router.navigate(['/order/payment-status']);
        },
        error: (resError: ResponseError) => {
          this.loading.set(false);
          console.error(resError.error.message);
        },
      });
  }

  private deleteShoppingSession() {
    this.shoppingSessionApi.delete().subscribe();
  }
}
