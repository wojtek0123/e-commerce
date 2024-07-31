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
import { AccordionModule } from 'primeng/accordion';
import { DatePipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { OrderItemAccordionComponent } from './order-item-accordion/order-item-accordion.component';
import { SkeletonModule } from 'primeng/skeleton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'lib-orders',
  standalone: true,
  imports: [
    AccordionModule,
    DatePipe,
    SkeletonModule,
    NgOptimizedImage,
    OrderItemAccordionComponent,
    BreadcrumbModule,
  ],
  template: `
    <div class="flex flex-column gap-4">
      @if (loading()) {
        @for (_ of skeletons; track $index) {
          <div
            class="flex align-items-center justify-content-between surface-card border-round w-full p-4"
          >
            <div class="flex flex-column gap-5">
              <p-skeleton width="8rem" height="1.75rem" />
              <p-skeleton width="5rem" height="1.25rem" />
            </div>
            <div class="flex flex-column align-items-end gap-5">
              <p-skeleton width="11rem" height="1.75rem" />
              <p-skeleton width="4rem" height="1.25rem" />
            </div>
          </div>
        }
      } @else {
        <p-breadcrumb [model]="breadcrumbs()" />
        @for (order of orders(); track order.id) {
          <lib-order-item-accordion-component [order]="order" />
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  private orderDetailsApi = inject(OrderDetailsApiService);
  private destroyRef = inject(DestroyRef);

  breadcrumbs = signal<MenuItem[]>([
    { label: 'Home', routerLink: '/' },
    { label: 'Orders' },
  ]);

  orders = signal<OrderDetails[]>([]);
  loading = signal(false);
  skeletons = new Array(3);

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
