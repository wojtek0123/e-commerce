import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { OrderDetailsApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { catchError, map, of } from 'rxjs';

export const paymentStatusGuard: CanMatchFn = (
  _: Route,
  segments: UrlSegment[],
) => {
  const orderDetailsApi = inject(OrderDetailsApiService);
  const router = inject(Router);
  const orderDetailsId = segments.at(0)?.path;
  const appRoutePaths = inject(APP_ROUTE_PATHS_TOKEN);

  if (!orderDetailsId) {
    return router.createUrlTree([appRoutePaths.HOME()]);
  }

  return orderDetailsApi.getUnique(orderDetailsId).pipe(
    map(
      (orderDetails) =>
        orderDetails.status === 'NEW' ||
        router.createUrlTree([appRoutePaths.HOME()]),
    ),
    catchError(() => of(router.createUrlTree([appRoutePaths.HOME()]))),
  );
};
