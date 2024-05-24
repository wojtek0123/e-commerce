import { Component, OnInit, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import {
  appRouterConfig,
  orderRoutePaths,
} from '@e-commerce/client-web-app/shared/utils/router-config';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-order-shell',
  standalone: true,
  imports: [StepsModule, CardModule],
  template: `
    <p-card>
      <p-steps
        [model]="stepItems"
        [readonly]="false"
        [activeIndex]="activeIndex()"
        (activeIndexChange)="onActiveIndexChange($event)"
      />
    </p-card>
    <router-outlet />
  `,
})
export class OrderShellComponent implements OnInit {
  private router = inject(Router);

  activeIndex = signal(0);
  stepItems: MenuItem[] = [
    {
      label: 'Cart items',
      routerLink: appRouterConfig.order.cartItemsPath,
    },
    {
      label: 'Delivery address',
      routerLink: appRouterConfig.order.deliveryAddressPath,
    },
    {
      label: 'Payment',
      routerLink: appRouterConfig.order.paymentPath,
    },
    {
      label: 'Summary',
      routerLink: appRouterConfig.order.summaryPath,
    },
  ];

  ngOnInit(): void {
    this.router.navigate([orderRoutePaths.cartItems]);
  }

  onActiveIndexChange(event: number) {
    this.activeIndex.set(event);
  }
}
