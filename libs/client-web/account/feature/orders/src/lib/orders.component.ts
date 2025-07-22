import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import {
  OrderColumn,
  OrdersStore,
} from '@e-commerce/client-web/account/data-access';
import {
  OrderDetails,
  OrderDetailsBase,
  OrderDetailsItem,
} from '@e-commerce/shared/api-models';
import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { OrderComponent } from '@e-commerce/client-web/account/ui';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerLeftDirective } from '@e-commerce/client-web/shared/utils';
import { DrawerModule } from 'primeng/drawer';
import { StatusToServerityPipe } from './pipes/status-to-severity.pipe';
import { ErrorAndRetryMessageComponent } from '@e-commerce/client-web/shared/ui';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-orders',
  standalone: true,
  imports: [
    TableModule,
    CurrencyPipe,
    DatePipe,
    SkeletonModule,
    DrawerModule,
    DrawerLeftDirective,
    OrderComponent,
    TagModule,
    StatusToServerityPipe,
    DialogModule,
    ButtonModule,
    ErrorAndRetryMessageComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly store = inject(OrdersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);
  private readonly breakpointObserver = inject(BreakpointObserver);

  public orders = this.store.orders;
  public loading = this.store.loading;
  public error = this.store.error;

  public selectedOrderId = signal<OrderDetailsBase['id'] | null>(null);
  public columns = signal<OrderColumn[]>([
    { header: 'Date', field: 'createdAt' },
    { header: 'Status', field: 'status' },
    { header: 'Total', field: 'total' },
  ]);
  public skeletons = signal(new Array(10));
  protected drawerVisible = linkedSignal(() => {
    const selectedOrderId = this.selectedOrderId();

    if (window.innerWidth > 1534) return false;

    return !!selectedOrderId;
  });

  public selectedOrder = this.store.selectedOrder.data;
  public selectedOrderLoading = this.store.selectedOrder.loading;
  public selectedOrderError = this.store.selectedOrder.error;

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 1534px)')
      .pipe(
        map(({ matches }) => matches),
        takeUntilDestroyed(),
      )
      .subscribe((matches) => {
        this.drawerVisible.set(matches && !!this.selectedOrderId());
      });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['orderDetailsId'];

    if (!id) return;

    this.selectedOrderId.set(id);

    this.store.getOrderDetails({ id });

    this.router.navigate([], { queryParams: null, replaceUrl: true });
  }

  public toggleOrderSelection(order: OrderDetails | null) {
    if (order) {
      this.selectOrder(order.id);
    } else {
      this.unselectOrder();
    }
  }

  public selectOrder(id: OrderDetails['id']) {
    this.selectedOrderId.set(id);
    this.store.getOrderDetails({ id });
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

  public goToBookDetails({ book: { id } }: OrderDetailsItem) {
    this.router.navigate([this.appRoutePaths.BOOK(id)]);
  }
}
