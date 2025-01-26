import { Route } from '@angular/router';
import { paymentStatusGuard } from './guards/payment-status.guard';
import { APP_ROUTES_PARAMS } from '@e-commerce/client-web/shared/app-config';
import { refreshShoppingSessionAfterPurchaseResolver } from './resolvers/refresh-shopping-session-after-purchase.resolver';

export const paymentStatusRoutes: Route[] = [
  {
    path: `:${APP_ROUTES_PARAMS.PAYMENT_STATUS_ORDER_DETAILS_ID}`,
    canMatch: [paymentStatusGuard],
    resolve: { data: refreshShoppingSessionAfterPurchaseResolver },
    loadComponent: () =>
      import('./payment-status.component').then(
        (c) => c.PaymentStatusComponent,
      ),
  },
];
