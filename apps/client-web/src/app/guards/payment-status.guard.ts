import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { OrderDetailsApiService } from '@e-commerce/client-web/shared/data-access';
import { catchError, map, of } from 'rxjs';

export const paymentStatusGuard: CanMatchFn = (
  _: Route,
  segments: UrlSegment[]
) => {
  const orderDetailsApi = inject(OrderDetailsApiService);
  const router = inject(Router);
  const orderDetailsId = segments[1].path;

  return orderDetailsApi.getUnique(orderDetailsId).pipe(
    map(
      (orderDetails) =>
        orderDetails.status === 'NEW' || router.createUrlTree(['/'])
    ),
    catchError(() => of(router.createUrlTree(['/'])))
  );
};
