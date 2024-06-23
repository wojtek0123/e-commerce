import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  signal,
} from '@angular/core';
import { OrderShippingComponent } from '@e-commerce/clien-web-app/order/ui/order-shipping';
import {
  Step,
  OrderDetailsInfo,
} from '@e-commerce/client-web-app/order/data-access';
import { OrderDetailsComponent } from '@e-commerce/client-web-app/order/ui/order-details';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { OrderPaymentComponent } from '@e-commerce/client-web-app/order/ui/order-payment';

@Component({
  selector: 'lib-shell',
  standalone: true,
  imports: [
    StepsModule,
    ToastModule,
    OrderDetailsComponent,
    OrderShippingComponent,
    OrderPaymentComponent,
  ],
  template: `
    <p-toast />
    <div class="max-width-1440px mx-auto">
      <p-steps
        class="mx-auto"
        [model]="steps()"
        [activeIndex]="activeStepIndex()"
      />
      <div class="container mt-6">
        <div class="content">
          @if (step() === 'address') {
          <lib-order-details (changeStepEvent)="changeStep($event)" />
          } @else if (step() === 'shipping') {
          <lib-order-shipping (changeStepEvent)="changeStep($event)" />
          } @else {
          <lib-order-payment
            (changeStepEvent)="changeStep($event)"
            [orderDetails]="orderDetails()"
          />
          }
        </div>
        <div class="cart">CART component</div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  @HostBinding('class') class = 'flex flex-column p-3';

  step = signal<Step>('address');
  steps = signal<MenuItem[]>([
    { label: 'Address' },
    { label: 'Shipping' },
    { label: 'Payment' },
  ]).asReadonly();
  activeStepIndex = computed(() =>
    this.steps().findIndex(({ label }) => label?.toLowerCase() === this.step())
  );
  orderDetails = signal<OrderDetailsInfo>({
    shippingMethodId: null,
    userAddressId: null,
  });

  changeStep({
    step,
    orderDetails,
  }: {
    step: Step;
    orderDetails?: Partial<OrderDetailsInfo>;
  }) {
    this.step.set(step);

    if (orderDetails)
      this.orderDetails.update((prevState) => ({
        ...prevState,
        ...orderDetails,
      }));
  }
}
