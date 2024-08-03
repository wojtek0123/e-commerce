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
    if (!orderInformation.userAddress) {
      return router.createUrlTree(['/']);
    }
  }

  if (step?.next === 'payment-method') {
    if (!orderInformation.shippingMethod) {
      return router.createUrlTree(['/']);
    }
  }

  if (step?.next === 'summary') {
    if (!orderInformation.paymentMethod) {
      return router.createUrlTree(['/']);
    }
  }

  if (step && (path === step.next || path === step.previous)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
