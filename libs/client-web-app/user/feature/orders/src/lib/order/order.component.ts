import { AsyncPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseError } from '@e-commerce/client-web-app/shared/data-access/api-types';
import {
  OrderDetailsApiService,
  orderDetailsStatuses,
} from '@e-commerce/client-web-app/user/data-access';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StepsModule } from 'primeng/steps';
import { catchError, ignoreElements, map } from 'rxjs';
import { FormFieldComponent } from '@e-commerce/client-web-app/shared/ui/form-field';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-order',
  template: `
    <div class="flex flex-column gap-3">
      <p-breadcrumb [model]="breadcrumbs()" />
      @if (
        {
          orderDetails: orderDetails$ | async,
          orderDetailsError: orderDetailsErrro$ | async,
        };
        as vm
      ) {
        @if (!vm.orderDetails && !vm.orderDetailsError) {
          @for (_ of skeletons(); track $index) {
            <div
              class="surface-hover border-round p-3 flex flex-column gap-5 lg:gap-3 lg:flex-row lg:justify-content-between"
            >
              <div class="flex flex-column gap-2">
                <p-skeleton width="8rem" height="2rem" />
                <p-skeleton width="12.5rem" height="1.5rem" />
              </div>
              <div class="flex flex-column gap-2 lg:align-items-end">
                <p-skeleton width="10rem" height="2rem" />
                <p-skeleton width="14rem" height="1.5rem" />
              </div>
            </div>
          }
        } @else if (!vm.orderDetails && vm.orderDetailsError) {
          <div>{{ vm.orderDetailsError }}</div>
        } @else if (vm.orderDetails && !vm.orderDetailsError) {
          <div class="surface-hover border-round p-3">
            <p-steps
              [activeIndex]="activeStep$ | async"
              [readonly]="true"
              [model]="stepStatuses()"
            />
          </div>

          <div
            class="surface-hover border-round p-3 flex flex-column gap-5 lg:gap-3 lg:flex-row lg:justify-content-between"
          >
            <div class="flex flex-column gap-2">
              <span class="text-xl lg:text-3xl">Order number</span>
              <span class="text-color-secondary lg:text-xl">{{
                vm.orderDetails.id
              }}</span>
            </div>
            <div class="flex flex-column gap-2 lg:align-items-end">
              <span class="text-xl lg:text-3xl">The order has been placed</span>
              <span class="text-color-secondary lg:text-xl">{{
                vm.orderDetails.createdAt | date
              }}</span>
            </div>
          </div>
          <div
            class="surface-hover border-round p-3 flex flex-column gap-5 lg:gap-3 lg:flex-row lg:justify-content-between"
          >
            <div class="flex flex-column gap-2">
              <span class="text-xl lg:text-3xl">Order address</span>
              <div class="flex align-items-center gap-1">
                <span class="text-color-secondary">{{
                  vm.orderDetails.userAddress.street
                }}</span>
                <span class="text-color-secondary">
                  {{ vm.orderDetails.userAddress.homeNumber }}
                  @if (vm.orderDetails.userAddress.houseNumber) {
                    /{{ vm.orderDetails.userAddress.houseNumber }}
                  }
                </span>
              </div>
              <div class="text-color-secondary">
                <span>{{ vm.orderDetails.userAddress.postcode }}, </span>
                <span>{{ vm.orderDetails.userAddress.city }}</span>
              </div>
              <span class="text-color-secondary">
                {{ vm.orderDetails.userAddress.country.name }}
              </span>
            </div>
            <div class="flex flex-column gap-2 lg:align-items-end">
              <span class="text-xl lg:text-3xl">Personal information</span>
              <div class="flex flex-column lg:align-items-end">
                <span class="text-color-secondary">
                  {{ vm.orderDetails.userAddress.firstName }}
                  {{ vm.orderDetails.userAddress.lastName }}
                </span>
                <span class="text-color-secondary">{{
                  vm.orderDetails.userAddress.phone
                }}</span>
              </div>
            </div>
          </div>
          <div
            class="surface-hover border-round p-3 flex flex-column gap-5 lg:gap-3 lg:flex-row lg:justify-content-between"
          >
            <div class="flex flex-column gap-2">
              <span class="text-xl lg:text-3xl">Payment method</span>
              <span class="text-color-secondary">{{
                vm.orderDetails.paymentDetails.provider
              }}</span>
            </div>
          </div>
          <div
            class="surface-hover border-round p-3 flex flex-column gap-5 lg:gap-3 lg:flex-row lg:justify-content-between"
          >
            <div class="flex flex-column gap-2">
              <span class="text-xl lg:text-3xl">Shipping method</span>
              <span class="text-color-secondary">
                {{ vm.orderDetails.shippingMethod.name }}
              </span>
            </div>
          </div>
          <div
            class="border-round overflow-hidden flex flex-column gap-2 surface-hover p-3"
          >
            <span class="text-xl lg:text-3xl">Order items</span>
            <p-table
              [value]="vm.orderDetails.orderItems"
              [tableStyle]="{
                'min-width': '50rem',
              }"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>Quanity</th>
                  <th>Price</th>
                  <th>Value</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>
                    <img
                      [ngSrc]="item.book.coverImage ?? ''"
                      [alt]="item.book.title"
                      width="150"
                      height="150"
                      priority
                    />
                  </td>
                  <td>{{ item.book.title }}</td>
                  <td>{{ item.book.title }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.book.price | currency: 'USD' }}</td>
                  <td>
                    {{ item.quantity * item.book.price | currency: 'USD' }}
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="footer">
                <tr>
                  <td colspan="3" class="text-right">Totals</td>
                  <td>
                    {{ (tableTotalSummary | async)?.quantity ?? 0 }}
                  </td>
                  <td>
                    {{
                      (tableTotalSummary | async)?.price ?? 0 | currency: 'USD'
                    }}
                  </td>
                  <td>
                    {{ vm.orderDetails.total | currency: 'USD' }}
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
          <div
            class="surface-hover border-round p-3 flex flex-column gap-5 lg:gap-3"
          >
            <span class="text-xl lg:text-3xl">Cost summary</span>
            <div
              class="flex flex-column gap-5 lg:gap-3 lg:flex-row lg:justify-content-end"
            >
              <div class="flex flex-column">
                <div
                  class="flex align-items-center gap-5 justify-content-between"
                >
                  <span class="text-base lg:text-lg">Value</span>
                  <span class="text-color-secondary">
                    {{ vm.orderDetails.total | currency: 'USD' }}
                  </span>
                </div>
                <div
                  class="flex align-items-center gap-5 justify-content-between"
                >
                  <span class="text-base lg:text-lg">Shipping cost</span>
                  <span class="text-color-secondary">
                    {{ vm.orderDetails.shippingMethod.price | currency: 'USD' }}
                  </span>
                </div>
                <div
                  class="flex align-items-center gap-5 text-xl lg:text-3xl justify-content-between mt-3"
                >
                  <span class="">Total cost</span>
                  <span class="text-color-secondary">
                    {{
                      vm.orderDetails.shippingMethod.price +
                        vm.orderDetails.total | currency: 'USD'
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-datatable .p-datatable-thead > tr > th {
          background: transparent;
        }

        .p-datatable .p-datatable-tbody > tr {
          background: transparent;
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
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
  private route = inject(ActivatedRoute);
  private orderDetailsApi = inject(OrderDetailsApiService);

  orderDetailsId = this.route.snapshot.params['id'];

  orderDetails$ = this.orderDetailsApi.getOrder(this.orderDetailsId);
  orderDetailsErrro$ = this.orderDetails$.pipe(
    ignoreElements(),
    catchError((resError: ResponseError) => resError.error.message),
  );
  activeStep$ = this.orderDetails$.pipe(
    map((orderDetails) =>
      orderDetailsStatuses.findIndex(
        (status) => status.toLowerCase() === orderDetails.status.toLowerCase(),
      ),
    ),
  );
  tableTotalSummary = this.orderDetails$.pipe(
    map((orderDetails) =>
      orderDetails.orderItems.reduce(
        (acc, orderItem) => ({
          quantity: acc.quantity + orderItem.quantity,
          price: acc.price + orderItem.book.price,
        }),
        { quantity: 0, price: 0 },
      ),
    ),
  );

  skeletons = signal(new Array(7));

  breadcrumbs = signal<MenuItem[]>([
    { label: 'Home', routerLink: '/' },
    { label: 'Orders', routerLink: '/user/orders' },
    { label: `Order no. ${this.orderDetailsId}` },
  ]);
  stepStatuses = signal<MenuItem[]>(
    orderDetailsStatuses.map((status) => ({
      label: status,
      icon: 'pi pi-setting',
    })),
  );
}
