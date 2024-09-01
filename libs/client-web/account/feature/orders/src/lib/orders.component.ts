import {
  Component,
  effect,
  HostListener,
  inject,
  OnInit,
  Pipe,
  PipeTransform,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { Store } from '@ngrx/store';
import {
  ordersActions,
  ordersSelectors,
} from '@e-commerce/client-web/account/data-access';
import {
  OrderDetails,
  OrderDetailsStatus,
} from '@e-commerce/client-web/shared/data-access';
import { CurrencyPipe, DatePipe, NgStyle } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SidebarModule } from 'primeng/sidebar';
import { OrderComponent } from '@e-commerce/client-web/account/ui';
import { TagModule } from 'primeng/tag';

interface Column {
  header: string;
  field: keyof OrderDetails;
}

@Pipe({ name: 'statusToSeverity', standalone: true })
export class StatusToServerityPipe implements PipeTransform {
  transform(orderDetailsStatus: OrderDetailsStatus) {
    switch (orderDetailsStatus) {
      case 'NEW':
        return 'danger';
      case 'PROCESSING':
        return 'warning';
      case 'SHIPPED':
        return 'info';
      case 'COMPLETED':
        return 'success';
    }
  }
}

@Component({
  selector: 'lib-orders',
  standalone: true,
  imports: [
    TableModule,
    CurrencyPipe,
    DatePipe,
    SkeletonModule,
    NgStyle,
    SidebarModule,
    OrderComponent,
    TagModule,
    StatusToServerityPipe,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly store = inject(Store);

  public orders = this.store.selectSignal(ordersSelectors.selectOrders);
  public loading = this.store.selectSignal(ordersSelectors.selectLoading);
  public error = this.store.selectSignal(ordersSelectors.selectError);

  public selectedOrder = signal<OrderDetails | null>(null);
  public columns = signal<Column[]>([
    { header: 'Date', field: 'createdAt' },
    { header: 'Status', field: 'status' },
    { header: 'Total', field: 'total' },
  ]);
  public skeletons = signal(new Array(10));
  protected sidebarVisible = signal(false);
  protected isWidthHigherThan1280 = signal(window.innerWidth > 1536);

  @HostListener('window:resize')
  onResize() {
    this.isWidthHigherThan1280.set(window.innerWidth > 1536);
  }

  constructor() {
    effect(
      () => {
        if (this.isWidthHigherThan1280()) {
          this.sidebarVisible.set(false);
        }

        if (!this.isWidthHigherThan1280() && this.selectedOrder()) {
          this.sidebarVisible.set(true);
        }
      },
      { allowSignalWrites: true },
    );
  }

  public ngOnInit(): void {
    this.store.dispatch(ordersActions.getOrders());
  }

  public selectOrder(order: OrderDetails | null) {
    if (window.innerWidth <= 1536) {
      this.sidebarVisible.set(!!order);
    }
    this.selectedOrder.set(order);
  }
}