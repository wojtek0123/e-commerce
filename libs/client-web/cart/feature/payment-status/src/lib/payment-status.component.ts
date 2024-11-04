import { Component, inject, OnInit, signal } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { CartStore } from '@e-commerce/client-web/cart/data-access';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  APP_ROUTE_PATHS_TOKEN,
  APP_ROUTES_PARAMS,
} from '@e-commerce/client-web/shared/app-config';

@Component({
  selector: 'lib-payment-status',
  standalone: true,
  imports: [ProgressSpinnerModule, ButtonModule, RouterLink],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.scss',
})
export class PaymentStatusComponent implements OnInit {
  private readonly cartStore = inject(CartStore);
  protected readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  private readonly route = inject(ActivatedRoute);
  protected readonly orderDetailsId =
    APP_ROUTES_PARAMS.PAYMENT_STATUS_ORDER_DETAILS_ID;

  public orderId = signal(
    this.route.snapshot.params[
      APP_ROUTES_PARAMS.PAYMENT_STATUS_ORDER_DETAILS_ID
    ],
  );
  public loading = signal(true);

  ngOnInit(): void {
    this.cartStore.deleteSession();

    setTimeout(() => {
      this.loading.set(false);
    }, 3000);
  }
}
