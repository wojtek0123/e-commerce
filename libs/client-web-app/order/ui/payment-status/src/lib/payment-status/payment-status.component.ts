import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-payment-status',
  standalone: true,
  imports: [ProgressSpinnerModule, RouterLink, ButtonModule],
  template: `
    <div class="h-screen w-screen">
      @if (loading()) {
      <div
        class="flex flex-column gap-6 align-items-center justify-content-center h-full"
      >
        <p-progressSpinner
          styleClass="w-4rem h-4rem"
          strokeWidth="8"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
        <span class="text-center">
          Some secure things are happening that will take money to pay for your
          order
        </span>
      </div>
      } @else {
      <div
        class="flex flex-column gap-6 align-items-center justify-content-center h-full"
      >
        <svg
          class="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            class="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            class="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
        <span>Pretend that you actually paid for this items :)</span>
        <p-button
          label="Go to your order details"
          routerLink="/"
          [link]="true"
        />
      </div>
      }
    </div>
  `,
  styleUrl: './payment-status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusComponent implements OnInit {
  paymentStatus = signal(null);
  loading = signal(true);

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 3000);
  }
}
