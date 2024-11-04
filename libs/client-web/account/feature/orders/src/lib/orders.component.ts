import {
  Component,
  computed,
  effect,
  inject,
  Pipe,
  PipeTransform,
  signal,
  untracked,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { OrdersStore } from '@e-commerce/client-web/account/data-access';
import {
  OrderDetails,
  OrderDetailsStatus,
} from '@e-commerce/client-web/shared/data-access/api-models';
import { CurrencyPipe, DatePipe, NgStyle } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SidebarModule } from 'primeng/sidebar';
import { OrderComponent } from '@e-commerce/client-web/account/ui';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTES_PARAMS } from '@e-commerce/client-web/shared/app-config';
import { toSignal } from '@angular/core/rxjs-interop';

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
        return 'warn';
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
    DialogModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private readonly store = inject(OrdersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public orders = this.store.orders;
  public loading = this.store.loading;
  public error = this.store.error;

  private _selectedOrder = computed(() => {
    const orderId =
      this.route.snapshot.queryParams[
        APP_ROUTES_PARAMS.PAYMENT_STATUS_ORDER_DETAILS_ID
      ];

    if (orderId) {
      this.router.navigate([], { queryParams: null, replaceUrl: true });
    }

    const order = this.orders().find(({ id }) => id === orderId);

    return signal(order ?? null);
  });
  public selectedOrder = computed(() => this._selectedOrder()());
  public columns = signal<Column[]>([
    { header: 'Date', field: 'createdAt' },
    { header: 'Status', field: 'status' },
    { header: 'Total', field: 'total' },
  ]);
  public skeletons = signal(new Array(10));
  protected sidebarVisible = computed(() => !!this.selectedOrder());

  public selectOrder(order: OrderDetails | null) {
    this._selectedOrder().set(order);
  }
}
