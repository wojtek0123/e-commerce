import { Injectable, computed, signal } from '@angular/core';
import { Step } from '../models/step.model';
import { StepConfiguration } from '../models/step-configuration.model';
import {
  UserAddress,
  ShippingMethod,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

interface OrderInformation {
  userAddressId: UserAddress['id'] | null;
  shippingMethodId: ShippingMethod['id'] | null;
}

@Injectable()
export class StepService {
  private readonly initialStep: StepConfiguration = {
    previous: null,
    current: null,
    next: 'address-information',
  };
  public stepConfiguration = signal<Map<Step, StepConfiguration>>(
    new Map([
      [
        'address-information',
        {
          previous: 'cart',
          current: 'address-information',
          next: 'shipping-method',
        },
      ],
      [
        'shipping-method',
        {
          previous: 'address-information',
          current: 'shipping-method',
          next: 'payment',
        },
      ],
      [
        'payment',
        {
          previous: 'shipping-method',
          current: 'payment',
          next: 'payment-status',
        },
      ],
    ]),
  ).asReadonly();
  private _step = signal<StepConfiguration | null>(this.initialStep);
  public step = this._step.asReadonly();

  private _orderInformation = signal<OrderInformation>({
    userAddressId: null,
    shippingMethodId: null,
  });
  public orderInformation = this._orderInformation.asReadonly();
  public waitingForOrderInformation = computed(() =>
    Object.values(this._orderInformation()).some((value) => !value),
  );

  setOrderInformation(orderInformation: Partial<OrderInformation>) {
    this._orderInformation.update((prevState) => ({
      ...prevState,
      ...orderInformation,
    }));
  }

  changeStep(current: Step) {
    const step = this.stepConfiguration().get(current);

    this._step.set(step ?? null);
  }

  resetStep() {
    this._step.set(this.initialStep);
  }
}
