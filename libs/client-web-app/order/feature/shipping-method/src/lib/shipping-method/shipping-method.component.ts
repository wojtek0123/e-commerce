import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepService } from '@e-commerce/client-web-app/order/data-access';
import { ButtonModule } from 'primeng/button';
import { ShippingMethodApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { AsyncPipe } from '@angular/common';
import {
  ResponseError,
  ShippingMethod,
} from '@e-commerce/client-web-app/shared/data-access/api-types';
import { catchError, ignoreElements } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { ErrorMessageComponent } from '@e-commerce/client-web-app/shared/ui/form-field';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'lib-shipping-method',
  template: `
    <div>Contact</div>
    <div>Email: wojtekpietraszuk&#64;gmail.com</div>
    <div>Address</div>
    <h3>Shipping method</h3>
    @if (
      { shippingMethods: shippingMethods$ | async, error: error$ | async };
      as vm
    ) {
      @if (!vm.shippingMethods && vm.error) {
        <div>{{ vm.error }}</div>
      } @else if (!vm.shippingMethods && !vm.error) {
        <p-skeleton width="100%" height="3rem" />
      } @else if (vm.shippingMethods && !vm.error) {
        @for (sm of shippingMethods$ | async; track sm.id) {
          <div
            class="flex align-items-center justify-content-between p-3 border-round surface-ground"
            (click)="select(sm)"
          >
            <div class="flex align-items-center gap-2 w-full">
              <p-radioButton
                [name]="sm.name"
                [value]="sm"
                [formControl]="selectShippingMethod"
                [inputId]="sm.id.toString()"
              />
              <label [for]="sm.id.toString()">
                {{ sm.name }}
              </label>
            </div>
            <div>{{ '$' + sm.price }}</div>
          </div>
        }
        @if (selectShippingMethod.invalid && selectShippingMethod.dirty) {
          <lib-error-message
            class="mt-3"
            message="If you want to get the order you should let us know about the method shipping"
          />
        }
      }
      <div class="flex align-items-center justify-content-between gap-3 mt-6">
        <p-button
          [outlined]="true"
          icon="pi pi-arrow-left"
          label="Back to address"
          routerLink="/order/address-information"
        />
        @if (vm.shippingMethods && !vm.error) {
          <p-button
            (onClick)="submit()"
            icon="pi pi-arrow-right"
            iconPos="right"
            label="Go to payment"
          />
        } @else {
          <p-skeleton width="11rem" height="2.5rem" />
        }
      </div>
    }
  `,
  standalone: true,
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    AsyncPipe,
    SkeletonModule,
    CardModule,
    ErrorMessageComponent,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodComponent implements OnInit {
  private shippingMethodApi = inject(ShippingMethodApiService);
  private stepService = inject(StepService);
  private router = inject(Router);

  selectShippingMethod = new FormControl<ShippingMethod | null>(
    null,
    Validators.required,
  );
  shippingMethods$ = this.shippingMethodApi.getShippingMethods();
  error$ = this.shippingMethods$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );

  skeletons = new Array(3);

  ngOnInit(): void {
    this.stepService.changeStep('shipping-method');
  }

  submit() {
    if (this.selectShippingMethod.invalid) {
      this.selectShippingMethod.markAsDirty();
      return;
    }

    this.stepService.setOrderInformation({
      shippingMethodId: this.selectShippingMethod.value?.id,
    });

    this.router.navigateByUrl('/order/payment');
  }

  select(sm: ShippingMethod) {
    this.selectShippingMethod.setValue(sm);
    this.stepService.setOrderInformation({
      shippingMethodPrice: sm.price,
    });
  }
}
