import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StepsModule } from 'primeng/steps';
import { FormFieldComponent } from '@e-commerce/client-web/shared/ui';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';
import {
  OrderDetails,
  orderDetailsStatuses,
} from '@e-commerce/client-web/shared/data-access/api-models';
import { DividerModule } from 'primeng/divider';
import { MenuItem } from 'primeng/api';

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
    FormFieldComponent,
    NgOptimizedImage,
    TableModule,
    CurrencyPipe,
    SkeletonModule,
    DividerModule,
    CurrencyPipe,
  ],
})
export class OrderComponent {
  public orderDetails = input.required<OrderDetails | null>();

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
  public stepStatuses = signal<MenuItem[]>(
    orderDetailsStatuses.map((status) => ({
      label: status,
      icon: 'pi pi-setting',
    })),
  );
}
