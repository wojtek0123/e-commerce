import { APP_INITIALIZER, Provider } from '@angular/core';
import { authActions } from '@e-commerce/client-web/auth/data-access';
import { cartActions } from '@e-commerce/client-web/cart/data-access';
import { ThemeService } from '../services/theme.service';
import { Store } from '@ngrx/store';

const initializeAppFactory = (store: Store) => () => {
  const userId = localStorage.getItem('user');
  const accessToken = localStorage.getItem('accessToken');

  store.dispatch(authActions.init());

  if (userId && accessToken) {
    store.dispatch(cartActions.getShoppingSession());
  } else {
    store.dispatch(cartActions.getCartItemsLocally());
  }
};

export const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAppFactory,
  multi: true,
  deps: [Store, ThemeService],
};
