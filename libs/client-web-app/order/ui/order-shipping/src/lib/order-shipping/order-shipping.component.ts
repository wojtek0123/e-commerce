import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Step } from '@e-commerce/client-web-app/order/data-access';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-order-shipping',
  template: `
    <div>Contact</div>
    <div>Email: wojtekpietraszuk&#64;gmail.com</div>
    <div>Address</div>

    <h3>Shipping method</h3>
    <div class="flex flex-wrap gap-3">
      <div class="flex align-items-center">
        <p-radioButton
          name="shipping-method"
          value="carrier"
          [formControl]="shoppingMethod"
          inputId="carrier"
        />
        <label for="carrier" class="ml-2">Carrier</label>
      </div>
    </div>
    <div class="flex align-items-center justify-content-between gap-3 mt-6">
      <p-button
        [outlined]="true"
        icon="pi pi-arrow-left"
        label="Back to address"
        (onClick)="changeStepEvent.emit('address')"
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
  imports: [RadioButtonModule, ReactiveFormsModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderShippingComponent {
  shoppingMethod = new FormControl('carrier', Validators.required);

  changeStepEvent = output<Step>();

  submit() {
    // send http request to set a shipping method to order

    if (this.shoppingMethod.invalid) return;

    console.log(this.shoppingMethod.value);
    this.changeStepEvent.emit('payment');
  }
}
