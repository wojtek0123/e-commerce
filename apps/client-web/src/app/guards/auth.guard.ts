import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { selectIsAuthenticated } from '@e-commerce/client-web/auth/data-access';
import { Store } from '@ngrx/store';

export const canMatchAuth: CanMatchFn = (
  _route: Route,
  _segments: UrlSegment[],
) => {
  return inject(Store).select(selectIsAuthenticated);
};
