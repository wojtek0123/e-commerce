import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { UserAddressApiService } from '@e-commerce/client-web-app/shared/data-access/api-services';
import { UserAddress } from '@e-commerce/client-web-app/shared/data-access/api-types';

export const userAddressResolver: ResolveFn<UserAddress> = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  return inject(UserAddressApiService).getUserAddress();
};
