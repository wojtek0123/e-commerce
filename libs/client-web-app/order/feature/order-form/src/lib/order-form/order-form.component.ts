import { Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { OrderDetailsComponent } from '@e-commerce/client-web-app/order/ui/order-details';
import { OrderSummaryComponent } from '@e-commerce/client-web-app/order/ui/order-summary';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-order-form',
  standalone: true,
  imports: [
    StepperModule,
    OrderDetailsComponent,
    ButtonModule,
    RouterLink,
    OrderSummaryComponent,
  ],
  template: `
    <div class="max-w-1400px mx-auto">
      <p-stepper>
        <p-stepperPanel header="Order details">
          <ng-template
            pTemplate="content"
            let-nextCallback="nextCallback"
            let-index="index"
          >
            <lib-order-details [callback]="nextCallback" />
          </ng-template>
        </p-stepperPanel>
        <p-stepperPanel header="Summary">
          <ng-template
            pTemplate="content"
            let-nextCallback="nextCallback"
            let-index="index"
          >
            <lib-order-summary />

            <div class="flex pt-4 justify-content-end">
              <p-button
                label="Go to summary"
                icon="pi pi-arrow-right"
                iconPos="right"
                (onClick)="nextCallback.emit()"
              />
            </div>
          </ng-template>
        </p-stepperPanel>
      </p-stepper>
    </div>
  `,
  styles: [
    `
      .max-w-1400px {
        max-width: 1400px;
        width: 100%;
      }

      :host ::ng-deep {
        .p-stepper .p-stepper-nav {
          margin: 1rem;
        }

        .p-stepper-panels {
          background: transparent;
          border-radius: var(--border-radius);
        }
      }
    `,
  ],
})
export class OrderFormComponent {}
