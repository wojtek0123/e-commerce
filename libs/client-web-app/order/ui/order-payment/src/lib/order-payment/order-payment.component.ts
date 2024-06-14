import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Step } from '@e-commerce/client-web-app/order/data-access';

@Component({
  selector: 'lib-order-payment',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="flex align-items-center justify-content-between gap-3 mt-6">
      <p-button
        [outlined]="true"
        icon="pi pi-arrow-left"
        label="Back to shipping"
        (onClick)="changeStepEvent.emit('shipping')"
      />
      <p-button
        (onClick)="changeStepEvent.emit('payment')"
        icon="pi pi-arrow-right"
        iconPos="right"
        label="Go to payment"
      />
    </div>
  `,
})
export class OrderPaymentComponent {
  changeStepEvent = output<Step>();
}
