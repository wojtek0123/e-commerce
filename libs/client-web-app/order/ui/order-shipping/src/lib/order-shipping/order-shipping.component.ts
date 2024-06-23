import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  OrderDetailsInfo,
  Step,
} from '@e-commerce/client-web-app/order/data-access';
import { ButtonModule } from 'primeng/button';
import { ShippingMethodApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { AsyncPipe } from '@angular/common';
import {
  ResponseError,
  ShippingMethod,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { take } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'lib-order-shipping',
  template: `
    <div>Contact</div>
    <div>Email: wojtekpietraszuk&#64;gmail.com</div>
    <div>Address</div>
    <h3>Shipping method *</h3>
    @if (loading()) {
    <p-skeleton width="100%" height="3rem" />
    } @else { @if (!!error()) {
    <div>{{ error() }}</div>
    } @else { @for (sm of shippingMethods(); track sm.id) {
    <div
      class="flex align-items-center justify-content-between p-3 border-round surface-card"
      (click)="selectShippingMethodId.setValue(sm.id)"
    >
      <div class="flex align-items-center gap-2 w-full">
        <p-radioButton
          [name]="sm.name"
          [value]="sm.id"
          [formControl]="selectShippingMethodId"
          [inputId]="sm.id.toString()"
        />
        <label [for]="sm.id.toString()">
          {{ sm.name }}
        </label>
      </div>
      <div>{{ '$' + sm.price }}</div>
    </div>
    } @if (selectShippingMethodId.invalid && selectShippingMethodId.dirty) {
    <small class="text-red-500 block mt-3">
      If you want to get the order you should let us know about the method
      shipping
    </small>
    } }}
    <div class="flex align-items-center justify-content-between gap-3 mt-6">
      <p-button
        [outlined]="true"
        icon="pi pi-arrow-left"
        label="Back to address"
        (onClick)="changeStepEvent.emit({ step: 'address' })"
      />
      <p-button
        (onClick)="submit()"
        icon="pi pi-arrow-right"
        iconPos="right"
        label="Go to payment"
      />
    </div>
  `,
  standalone: true,
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    AsyncPipe,
    SkeletonModule,
    CardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderShippingComponent implements OnInit {
  private shippingMethodApi = inject(ShippingMethodApiService);

  selectShippingMethodId = new FormControl<ShippingMethod['id'] | null>(
    null,
    Validators.required
  );
  shippingMethods = signal<ShippingMethod[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  skeletons = new Array(3);

  changeStepEvent = output<{
    step: Step;
    orderDetails?: Partial<OrderDetailsInfo>;
  }>();

  ngOnInit(): void {
    this.shippingMethodApi
      .getShippingMethods()
      .pipe(take(1))
      .subscribe({
        next: (shippingMethods) => {
          this.shippingMethods.set(shippingMethods);
          this.loading.set(false);
        },
        error: (resError: ResponseError) => {
          this.error.set(resError.error.message);
          this.loading.set(false);
        },
      });
  }

  submit() {
    // send http request to set a shipping method to order

    if (this.selectShippingMethodId.invalid) {
      this.selectShippingMethodId.markAsDirty();
      return;
    }

    this.changeStepEvent.emit({
      step: 'payment',
      orderDetails: {
        shippingMethodId: this.selectShippingMethodId.value,
      },
    });
  }
}
