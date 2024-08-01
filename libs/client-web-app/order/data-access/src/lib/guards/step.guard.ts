import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StepService } from '../services/step.service';
import { inject } from '@angular/core';

export const stepGuard: CanActivateChildFn = (
  _next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const stepService = inject(StepService);
  const router = inject(Router);

  const orderInformation = stepService.orderInformation();
  const step = stepService.step();
  const path = state.url.split('/').at(-1);

  if (step?.next === 'shipping-method') {
    if (!orderInformation.userAddressId) {
      return router.createUrlTree(['/']);
    }
  }

  if (step?.next === 'payment') {
    if (!orderInformation.shippingMethodId) {
      return router.createUrlTree(['/']);
    }
  }

  if (step && (path === step.next || path === step.previous)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
