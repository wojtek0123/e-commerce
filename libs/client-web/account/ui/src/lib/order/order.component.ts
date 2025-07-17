import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';
import {
  OrderDetails,
  OrderDetailsItem,
  orderDetailsStatuses,
} from '@e-commerce/shared/api-models';
import { DividerModule } from 'primeng/divider';
import { MenuItem } from 'primeng/api';
import { StepsComponent } from '@e-commerce/client-web/shared/ui';

@Component({
  selector: 'lib-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    BreadcrumbModule,
    StepsModule,
    NgOptimizedImage,
    TableModule,
    CurrencyPipe,
    SkeletonModule,
    DividerModule,
    CurrencyPipe,
    StepsComponent,
  ],
})
export class OrderComponent {
  public orderDetails = input.required<OrderDetails | null>();

  public rowClicked = output<OrderDetailsItem>();

  public bookCostTotal = computed(() =>
    this.orderDetails()?.orderItems.reduce(
      (acc, orderItem) => ({
        quantity: acc.quantity + orderItem.quantity,
        price: acc.price + orderItem.book.price * orderItem.quantity,
      }),
      { quantity: 0, price: 0 },
    ),
  );

  public activeStep = computed(() =>
    orderDetailsStatuses.findIndex(
      (status) => status === this.orderDetails()?.status,
    ),
  );

  protected orderDetailsStatuses = signal(
    orderDetailsStatuses.map((status) => status.replaceAll('_', ' ')),
  ).asReadonly();
}
