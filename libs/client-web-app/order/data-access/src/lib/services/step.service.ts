import { Injectable, computed, signal } from '@angular/core';
import { Step } from '../models/step.model';
import { StepConfiguration } from '../models/step-configuration.model';
import {
  UserAddress,
  ShippingMethod,
} from '@e-commerce/client-web-app/shared/data-access/api-types';

interface OrderInformation {
  userAddress: UserAddress | null;
  shippingMethod: ShippingMethod | null;
  paymentMethod: string | null;
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
          next: 'payment-method',
        },
      ],
      [
        'payment-method',
        {
          previous: 'shipping-method',
          current: 'payment-method',
          next: 'summary',
        },
      ],
      [
        'summary',
        {
          previous: 'shipping-method',
          current: 'summary',
          next: 'payment-status',
        },
      ],
    ]),
  ).asReadonly();
  private _step = signal<StepConfiguration | null>(this.initialStep);
  public step = this._step.asReadonly();

  private _orderInformation = signal<OrderInformation>({
    userAddress: null,
    shippingMethod: null,
    paymentMethod: '',
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
