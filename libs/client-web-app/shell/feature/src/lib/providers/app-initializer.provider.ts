import { APP_INITIALIZER, Provider } from '@angular/core';
import { AuthService } from '@e-commerce/client-web-app/shared/data-access/auth';
import { categoryActions } from '@e-commerce/client-web-app/shared/data-access/category';
import { Store } from '@ngrx/store';
import { jwtDecode } from 'jwt-decode';

const initializeAppFactory = (store: Store, authService: AuthService) => () => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (refreshToken) {
    const { exp } = jwtDecode(refreshToken);
    const expirationTime = (exp ?? 0) * 1000 - 60000;

    if (expirationTime <= Date.now()) {
      authService.removeSession();
    }
  }

  store.dispatch(categoryActions.getCategories());
};

export const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAppFactory,
  multi: true,
  deps: [Store, AuthService],
};
