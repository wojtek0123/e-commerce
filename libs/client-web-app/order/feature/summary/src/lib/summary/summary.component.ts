import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { StepService } from '@e-commerce/client-web-app/order/data-access';
import {
  OrderDetailsApiService,
  ShoppingSessionApiService,
} from '@e-commerce/client-web-app/shared/data-access/api-services';
import { take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';
import { CartService } from '@e-commerce/client-web-app/shared/data-access/stores';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-summary',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule, RouterLink, DividerModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent implements OnInit {
  private stepService = inject(StepService);
  private orderDetailsApi = inject(OrderDetailsApiService);
  private shoppingSessionApi = inject(ShoppingSessionApiService);
  private cartService = inject(CartService);
  private router = inject(Router);

  loading = signal(false);

  addressInformation = computed(
    () => this.stepService.orderInformation().userAddress,
  );

  shippingMethod = computed(
    () => this.stepService.orderInformation().shippingMethod,
  );

  cartItemsTotal = this.cartService.total;
  shippingPrice = computed(
    () => this.stepService.orderInformation().shippingMethod?.price ?? 0,
  );
  total = computed(() => this.cartItemsTotal() + this.shippingPrice());

  ngOnInit(): void {
    this.stepService.changeStep('summary');
  }

  submit() {
    if (!this.addressInformation() || !this.shippingMethod()) return;

    this.orderDetailsApi
      .create({
        shippingMethodId: this.shippingMethod()!.id,
        userAddressId: this.addressInformation()!.id,
      })
      .pipe(take(1))
      .subscribe({
        next: async () => {
          this.loading.set(false);
          this.deleteShoppingSession();
          await this.router.navigate(['/order/payment-status']);
        },
        error: (resError: ResponseError) => {
          this.loading.set(false);
          console.error(resError.error.message);
        },
      });
  }

  private deleteShoppingSession() {
    this.shoppingSessionApi.delete().pipe(take(1)).subscribe();
  }
}
