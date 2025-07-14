import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { ProgressBar } from 'primeng/progressbar';
@Component({
  selector: 'lib-payment-status',
  standalone: true,
  imports: [ProgressBar, RouterLink],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.scss',
})
export class PaymentStatusComponent implements OnInit {
  #appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  orderDetailsId = input<string>();

  ordersUrl = this.#appRoutePaths.ORDERS();
  loading = signal(true);

  ngOnInit(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 3000);
  }
}
