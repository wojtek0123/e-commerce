import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  OrderDetails,
  OrderDetailsApiService,
} from '@e-commerce/client-web-app/user/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';

@Component({
  selector: 'lib-orders',
  standalone: true,
  imports: [],
  template: `
    @if(loading()) {
    <div>Loading...</div>
    } @else {
    <div>
      @for(order of orders(); track order.id) {
      <div>{{ order.id }}</div>
      }
    </div>
    }
  `,
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  private orderDetailsApi = inject(OrderDetailsApiService);
  private destroyRef = inject(DestroyRef);

  orders = signal<OrderDetails[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.loading.set(true);
    this.orderDetailsApi
      .getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.loading.set(false);
        },
        error: (resError: ResponseError) => {
          this.loading.set(false);
        },
      });
  }
}
