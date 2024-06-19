import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Step } from '@e-commerce/client-web-app/order/data-access';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';
import { RouterLink } from '@angular/router';

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
          <label for="card-number">Card number</label>
          <p-inputMask
            mask="9999 9999 9999 9999"
            class="w-full"
            id="card-number"
            [ngClass]="{
              'ng-invalid ng-dirty':
                form.controls.cardNumber.invalid &&
                (form.controls.cardNumber.dirty || form.invalid)
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
            <label for="expiration-date">Expiration date</label>
            <p-inputMask
              mask="99/9999"
              class="w-full"
              id="expiration-date"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  form.controls.expirationDate.invalid &&
                  (form.controls.expirationDate.dirty || form.invalid)
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
            <label for="expiration-date">Security code</label>
            <p-inputMask
              mask="999"
              class="w-full"
              id="security-code"
              [ngClass]="{
                'ng-invalid ng-dirty':
                  form.controls.securityCode.invalid &&
                  (form.controls.securityCode.dirty || form.invalid)
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
        (onClick)="changeStepEvent.emit('shipping')"
      />
      <a class="p-button" routerLink="payment-status">
        <i class="pi pi-arrow-right"></i>
        <span>Pay</span>
      </a>
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
  changeStepEvent = output<Step>();

  form = new FormGroup({
    cardNumber: new FormControl(),
    expirationDate: new FormControl(),
    securityCode: new FormControl(),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAsDirty();
      return;
    }

    // create order details model
  }
}
