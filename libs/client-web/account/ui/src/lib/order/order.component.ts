import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
} from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StepsModule } from 'primeng/steps';
import { FormFieldComponent } from '@e-commerce/client-web/shared/ui';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';
import { OrderDetails } from '@e-commerce/client-web/shared/data-access';

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
  ],
})
export class OrderComponent {
  orderDetails = input.required<OrderDetails | null>();

  tableTotalSummary = computed(() =>
    this.orderDetails()?.orderItems.reduce(
      (acc, orderItem) => ({
        quantity: acc.quantity + orderItem.quantity,
        price: acc.price + orderItem.book.price,
      }),
      { quantity: 0, price: 0 },
    ),
  );

  // stepStatuses = signal<MenuItem[]>(
  //   orderDetailsStatuses.map((status) => ({
  //     label: status,
  //     icon: 'pi pi-setting',
  //   })),
  // );
}
