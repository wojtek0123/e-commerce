import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Pipe,
  PipeTransform,
  signal,
  untracked,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { OrdersStore } from '@e-commerce/client-web/account/data-access';
import {
  OrderDetails,
  OrderDetailsBase,
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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly store = inject(OrdersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public orders = this.store.orders;
  public loading = this.store.loading;
  public error = this.store.error;

  public selectedOrderId = signal<OrderDetailsBase['id'] | null>(null);
  public columns = signal<Column[]>([
    { header: 'Date', field: 'createdAt' },
    { header: 'Status', field: 'status' },
    { header: 'Total', field: 'total' },
  ]);
  public skeletons = signal(new Array(10));
  protected sidebarVisible = computed(() => !!this.selectedOrderId());

  public selectedOrder = this.store.selectedOrder.data;
  public selectedOrderLoading = this.store.selectedOrder.loading;
  public selectedOrderError = this.store.selectedOrder.error;

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['orderDetailsId'];

    if (!id) return;

    this.selectedOrderId.set(id);

    this.store.getOrderDetails({ id });

    this.router.navigate([], { queryParams: null, replaceUrl: true });
  }

  public selectOrder(order: OrderDetails | null) {
    if (!order) return;
    this.selectedOrderId.set(order?.id);

    this.store.getOrderDetails({ id: order.id });
  }

  public unselectOrder() {
    this.selectedOrderId.set(null);
    this.store.unselectOrder();
  }

  public getOrderDetails() {
    const id = this.selectedOrderId();

    if (!id) return;

    this.store.getOrderDetails({ id });
  }

  public getOrders() {
    this.store.getOrders();
  }
}
